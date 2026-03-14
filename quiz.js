import { QUESTIONS, getFixedQuestions, getPoolQuestions } from "./questions.js";
import { getTitleResult } from "./titles.js";

const STORAGE_KEY = "sm_diagnosis_session_v1";

const FIXED_COUNT = 8;
const RANDOM_PER_AXIS = 22;
const TOTAL_COUNT = 96;
const TOTAL_NETA_COUNT = 24;

const questionCard = document.getElementById("questionCard");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function sample(array, count) {
  return shuffle(array).slice(0, count);
}

function countNeta(list) {
  return list.filter(q => q.category === "neta").length;
}

function getRandomQuestions() {
  const fixed = getFixedQuestions();
  const pool = getPoolQuestions();

  if (fixed.length !== FIXED_COUNT) {
    throw new Error(`固定質問が ${FIXED_COUNT} 問ではありません。現在 ${fixed.length} 問`);
  }

  const fixedNeta = countNeta(fixed);
  const randomNetaNeeded = TOTAL_NETA_COUNT - fixedNeta;

  const axes = ["FI", "RC", "OA", "TP"];
  const baseNeta = Math.floor(randomNetaNeeded / axes.length);
  const remainder = randomNetaNeeded % axes.length;

  const picked = [];

  axes.forEach((axis, idx) => {
    const axisPool = pool.filter(q => q.axis === axis);
    const netaPool = axisPool.filter(q => q.category === "neta");
    const nonNetaPool = axisPool.filter(q => q.category !== "neta");

    const netaNeed = baseNeta + (idx < remainder ? 1 : 0);
    const normalNeed = RANDOM_PER_AXIS - netaNeed;

    if (axisPool.length < RANDOM_PER_AXIS) {
      throw new Error(`${axis}軸の質問が不足しています`);
    }
    if (netaPool.length < netaNeed) {
      throw new Error(`${axis}軸のネタ質問が不足しています`);
    }
    if (nonNetaPool.length < normalNeed) {
      throw new Error(`${axis}軸の通常質問が不足しています`);
    }

    picked.push(...sample(netaPool, netaNeed), ...sample(nonNetaPool, normalNeed));
  });

  const finalQuestions = shuffle([...fixed, ...picked]);

  if (finalQuestions.length !== TOTAL_COUNT) {
    throw new Error(`出題数が ${TOTAL_COUNT} 問ではありません`);
  }
  if (countNeta(finalQuestions) !== TOTAL_NETA_COUNT) {
    throw new Error(`ネタ質問数が ${TOTAL_NETA_COUNT} 問ではありません`);
  }

  return finalQuestions;
}

function answerToScore(answer) {
  switch (answer) {
    case 1: return 2;
    case 2: return 1;
    case 3: return 0.5;
    case 4: return -1;
    case 5: return -2;
    default: return 0;
  }
}

function calculateAxisScores(questions, answers) {
  const scores = { FI: 0, RC: 0, OA: 0, TP: 0 };

  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;

    const raw = answerToScore(answer) * q.weight;

    const positive =
      (q.axis === "FI" && q.side === "F") ||
      (q.axis === "RC" && q.side === "R") ||
      (q.axis === "OA" && q.side === "O") ||
      (q.axis === "TP" && q.side === "T");

    scores[q.axis] += positive ? raw : -raw;
  }

  return scores;
}

function getTypeCode(scores) {
  const f = scores.FI >= 0 ? "F" : "I";
  const r = scores.RC >= 0 ? "R" : "C";
  const o = scores.OA >= 0 ? "O" : "A";
  const t = scores.TP >= 0 ? "T" : "P";
  return `${f}${r}${o}${t}`;
}

function calculateSMPercent(scores) {
  const F = Math.max(scores.FI, 0);
  const I = Math.max(-scores.FI, 0);
  const R = Math.max(scores.RC, 0);
  const C = Math.max(-scores.RC, 0);
  const O = Math.max(scores.OA, 0);
  const A = Math.max(-scores.OA, 0);
  const T = Math.max(scores.TP, 0);
  const P = Math.max(-scores.TP, 0);

  const mRaw = F + R + O + T;
  const sRaw = I + C + A + P;
  const total = mRaw + sRaw || 1;

  return {
    mPercent: Math.round((mRaw / total) * 100),
    sPercent: Math.round((sRaw / total) * 100)
  };
}

function calculateFlatThinking(questions, answers) {
  let fRaw = 0;
  let fMax = 0;

  for (const q of questions) {
    if (q.axis === "FI" && q.side === "F") {
      const answer = answers[q.id];
      if (!answer) continue;
      const raw = Math.max(answerToScore(answer), 0) * q.weight;
      fRaw += raw;
      fMax += 2 * q.weight;
    }
  }

  return Math.round((fRaw / (fMax || 1)) * 100);
}

function calculateHoldIndex(questions, answers) {
  const total = questions.length || 1;
  const hold = Object.values(answers).filter(v => v === 3).length;
  return Math.round((hold / total) * 100);
}

function toBarPercent(score) {
  return Math.max(0, Math.min(100, Math.round(((score + 12) / 24) * 100)));
}

function getSubtitle(typeCode, title) {
  const map = {
    "FCAP::ドS": "盤面支配者",
    "ICAP::ドS": "最終支配者",
    "ICOT::ドS": "心理破壊者",
    "FROT::ドM": "静観受容者",
    "IROT::ドM": "深淵受容者"
  };
  return map[`${typeCode}::${title}`] || "タイプ特化型";
}

function getSMComment(mPercent, sPercent) {
  const diff = Math.abs(mPercent - sPercent);

  if (mPercent >= 95 && sPercent <= 5) return "完全に受けの本能へ振り切れた、純度の高いMタイプ。";
  if (sPercent >= 95 && mPercent <= 5) return "主導権を握ることが自然な、純度の高いSタイプ。";
  if (mPercent >= 85 && sPercent >= 85) return "攻めも受けも極端に高い、危険なカオス領域。";
  if (mPercent > sPercent && diff >= 20) return "プレッシャーや受容の中で強さを発揮するタイプ。";
  if (sPercent > mPercent && diff >= 20) return "主導や駆け引きの中で楽しさを感じるタイプ。";
  return "状況に応じて立ち位置を柔軟に変えられるバランス型。";
}

function getNextInfo(titleRow, mPercent, sPercent) {
  if (!titleRow.next) {
    return { nextTitle: null, nextDiff: null };
  }

  const diffs = [];
  if (typeof titleRow.next.targetM === "number") {
    diffs.push(titleRow.next.targetM - mPercent);
  }
  if (typeof titleRow.next.targetS === "number") {
    diffs.push(titleRow.next.targetS - sPercent);
  }

  const valid = diffs.filter(v => v >= 0);
  return {
    nextTitle: titleRow.next.title,
    nextDiff: valid.length ? Math.min(...valid) : 0
  };
}

function buildResult(questions, answers) {
  const axisScores = calculateAxisScores(questions, answers);
  const typeCode = getTypeCode(axisScores);
  const { mPercent, sPercent } = calculateSMPercent(axisScores);
  const titleRow = getTitleResult(mPercent, sPercent);
  const next = getNextInfo(titleRow, mPercent, sPercent);

  return {
    typeCode,
    title: titleRow.title,
    rank: titleRow.rank,
    titleComment: titleRow.comment,
    subtitle: getSubtitle(typeCode, titleRow.title),
    smComment: getSMComment(mPercent, sPercent),
    mPercent,
    sPercent,
    flatThinking: calculateFlatThinking(questions, answers),
    holdIndex: calculateHoldIndex(questions, answers),
    nextTitle: next.nextTitle,
    nextDiff: next.nextDiff,
    axes: {
      FI: toBarPercent(axisScores.FI),
      RC: toBarPercent(axisScores.RC),
      OA: toBarPercent(axisScores.OA),
      TP: toBarPercent(axisScores.TP)
    }
  };
}

function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function createNewSession() {
  const questions = getRandomQuestions();
  return {
    questions,
    answers: {},
    currentIndex: 0
  };
}

let session = loadSession() || createNewSession();
saveSession(session);

function renderQuestion() {
  const { questions, answers, currentIndex } = session;
  const q = questions[currentIndex];
  const currentValue = answers[q.id] || null;

  progressText.textContent = `${currentIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  const options = [
    [1, "① かなりそう思う"],
    [2, "② どちらかというとそう思う"],
    [3, "③ わからない / どちらでもない"],
    [4, "④ どちらかというとそう思わない"],
    [5, "⑤ そう思わない"]
  ];

  questionCard.innerHTML = `
    <h2 class="question-title">Q${currentIndex + 1}. ${q.text}</h2>
    <div class="option-list">
      ${options.map(([value, label]) => `
        <button class="option-btn ${currentValue === value ? "selected" : ""}" data-value="${value}">
          ${label}
        </button>
      `).join("")}
    </div>
  `;

  questionCard.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      session.answers[q.id] = Number(btn.dataset.value);
      saveSession(session);
      renderQuestion();
    });
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "結果を見る" : "次へ";
}

prevBtn.addEventListener("click", () => {
  if (session.currentIndex > 0) {
    session.currentIndex -= 1;
    saveSession(session);
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  const { questions, answers, currentIndex } = session;
  const currentQuestion = questions[currentIndex];

  if (!answers[currentQuestion.id]) {
    alert("回答を選んでください。");
    return;
  }

  if (currentIndex === questions.length - 1) {
    const result = buildResult(questions, answers);
    localStorage.setItem("sm_diagnosis_result_v1", JSON.stringify(result));
    window.location.href = "./result.html";
    return;
  }

  session.currentIndex += 1;
  saveSession(session);
  renderQuestion();
});

renderQuestion();
