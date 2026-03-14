import { TYPE_META, COMPATIBILITY_LABELS } from "./types.js";
import { saveDiagnosisResult, getStatsSummary } from "./firebase.js";

const resultCard = document.getElementById("resultCard");
const typeDetail = document.getElementById("typeDetail");
const compatibilitySection = document.getElementById("compatibilitySection");
const statsSection = document.getElementById("statsSection");

const raw = localStorage.getItem("sm_diagnosis_result_v1");

if (!raw) {
  resultCard.innerHTML = `
    <h1>結果が見つかりません</h1>
    <p class="muted">先に診断を実行してください。</p>
    <a class="btn primary" href="./quiz.html">診断へ</a>
  `;
  throw new Error("No result found");
}

const result = JSON.parse(raw);
const typeMeta = TYPE_META[result.typeCode];

function createMeter(percent) {
  return `
    <div class="meter">
      <div class="meter-fill" style="width:${percent}%"></div>
    </div>
  `;
}

function renderTopCard() {
  resultCard.innerHTML = `
    <div class="result-card-top">
      <div class="result-code">${result.typeCode} × ${result.title}</div>
      <div class="result-type">【${typeMeta.name}】</div>
      <div class="result-subtitle">―${result.subtitle}―</div>
      <p class="result-comment">「${result.titleComment}」</p>
    </div>

    <div class="bar-block">
      <div class="bar-row">
        <strong>S</strong>
        ${createMeter(result.sPercent)}
        <span>${result.sPercent}%</span>
      </div>
      <div class="bar-row">
        <strong>M</strong>
        ${createMeter(result.mPercent)}
        <span>${result.mPercent}%</span>
      </div>
    </div>

    ${result.nextTitle ? `<div class="next-box">NEXT：あと${result.nextDiff}%で ${result.nextTitle}</div>` : ""}

    <div class="axis-row">
      <strong>F/I</strong>
      ${createMeter(result.axes.FI)}
      <span>${result.axes.FI}%</span>
    </div>
    <div class="axis-row">
      <strong>R/C</strong>
      ${createMeter(result.axes.RC)}
      <span>${result.axes.RC}%</span>
    </div>
    <div class="axis-row">
      <strong>O/A</strong>
      ${createMeter(result.axes.OA)}
      <span>${result.axes.OA}%</span>
    </div>
    <div class="axis-row">
      <strong>T/P</strong>
      ${createMeter(result.axes.TP)}
      <span>${result.axes.TP}%</span>
    </div>
  `;
}

function renderTypeDetail() {
  typeDetail.innerHTML = `
    <h2 class="detail-title">${typeMeta.name}</h2>
    <p class="detail-copy">${typeMeta.shortCopy}</p>
    <p>${typeMeta.description}</p>
  `;
}

function renderCompatibility() {
  compatibilitySection.innerHTML = `
    <h2>相性タイプ</h2>
    ${["good", "calm", "stimulus", "bad"].map(key => `
      <div class="compat-group">
        <h3>${COMPATIBILITY_LABELS[key]}</h3>
        ${typeMeta.compatibility[key].map(([code, reason]) => `
          <div class="compat-item">
            <strong>${TYPE_META[code].name}（${code}）</strong>
            <p>${reason}</p>
          </div>
        `).join("")}
      </div>
    `).join("")}
  `;
}

async function renderStats() {
  statsSection.innerHTML = `<p class="muted">統計を読み込み中…</p>`;

  try {
    await saveDiagnosisResult({
      typeCode: result.typeCode,
      typeName: typeMeta.name,
      title: result.title,
      rank: result.rank,
      mPercent: result.mPercent,
      sPercent: result.sPercent,
      flatThinking: result.flatThinking,
      holdIndex: result.holdIndex
    });

    const stats = await getStatsSummary(result.typeCode, result.title);

    let trustText = "統計データがまだ少ないため参考値です。";
    if (stats.totalCount >= 500) {
      trustText = "診断数が十分に集まっており、高信頼の統計です。";
    } else if (stats.totalCount >= 100) {
      trustText = "診断数が一定以上あり、通常表示の統計です。";
    } else if (stats.totalCount >= 30) {
      trustText = "診断数が集まり始めており、参考値として表示しています。";
    }

    statsSection.innerHTML = `
      <h2>統計表示</h2>
      <p class="muted">${trustText}</p>
      <div class="stats-grid">
        <div class="stat-box">
          <strong>累計診断数</strong>
          <span>${stats.totalCount}件</span>
        </div>
        <div class="stat-box">
          <strong>このタイプの割合</strong>
          <span>${stats.typePercent}%</span>
        </div>
        <div class="stat-box">
          <strong>この称号の割合</strong>
          <span>${stats.titlePercent}%</span>
        </div>
        <div class="stat-box">
          <strong>タイプ出現数</strong>
          <span>${stats.typeCount}件</span>
        </div>
        <div class="stat-box">
          <strong>称号出現数</strong>
          <span>${stats.titleCount}件</span>
        </div>
        <div class="stat-box">
          <strong>FLAT思考指数</strong>
          <span>${result.flatThinking}%</span>
        </div>
        <div class="stat-box">
          <strong>保留指数</strong>
          <span>${result.holdIndex}%</span>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    statsSection.innerHTML = `
      <h2>統計表示</h2>
      <p class="muted">Firebase の設定がまだ完了していないか、Firestore ルールが未設定です。</p>
    `;
  }
}

renderTopCard();
renderTypeDetail();
renderCompatibility();
renderStats();
