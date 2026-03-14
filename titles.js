export const TITLE_TABLE = [
  { id:"mirror_1", priority:1, title:"ほぼ無害", rank:"C", comment:"まだ本性が眠っている可能性。", match:{mMin:1,mMax:1,sMin:1,sMax:1}, next:null },
  { id:"mirror_33", priority:1, title:"様子見の達人", rank:"R", comment:"状況を見極める慎重派。", match:{mMin:33,mMax:33,sMin:33,sMax:33}, next:null },
  { id:"mirror_50", priority:1, title:"五分五分の男", rank:"SR", comment:"SとMが完全均衡したタイプ。", match:{mMin:50,mMax:50,sMin:50,sMax:50}, next:null },
  { id:"mirror_69", priority:1, title:"69の支配者", rank:"SSR", comment:"攻めと受けを同時に楽しむ特異体質。", match:{mMin:69,mMax:69,sMin:69,sMax:69}, next:null },
  { id:"mirror_77", priority:1, title:"混沌予備軍", rank:"SSR", comment:"S/M両方の兆候を持つ。", match:{mMin:77,mMax:77,sMin:77,sMax:77}, next:null },
  { id:"mirror_88", priority:1, title:"深淵の住人", rank:"SSR", comment:"深いS/Mを両立するレアタイプ。", match:{mMin:88,mMax:88,sMin:88,sMax:88}, next:null },
  { id:"mirror_100", priority:1, title:"全能者", rank:"UR", comment:"SとMの両極を極めた存在。", match:{mMin:100,mMax:100,sMin:100,sMax:100}, next:null },

  { id:"ultimate_m", priority:2, title:"究極のドM", rank:"UR", comment:"試練すら快感へ変える極限領域。", match:{mMin:100,mMax:100,sMin:0,sMax:0}, next:null },
  { id:"absolute_maou", priority:2, title:"絶対魔王", rank:"UR", comment:"圧倒的カリスマで場を支配するラスボス。", match:{mMin:0,mMax:0,sMin:100,sMax:100}, next:null },
  { id:"chaos_god", priority:2, title:"混沌神", rank:"UR", comment:"あらゆる状況を楽しむ完全カオス。", match:{mMin:95,mMax:99,sMin:95,sMax:99}, next:null },

  { id:"pure_m", priority:3, title:"生粋のM", rank:"SSR", comment:"受けの本能だけで動く純度100％タイプ。", match:{mMin:95,mMax:99,sMin:0,sMax:5}, next:null },
  { id:"pure_s", priority:3, title:"生粋のS", rank:"SSR", comment:"主導権を握ることが自然な純粋支配型。", match:{mMin:0,mMax:5,sMin:95,sMax:99}, next:null },
  { id:"pure_observer", priority:3, title:"無欲の観測者", rank:"SSR", comment:"欲望よりも状況観察を優先する完全フラット型。", match:{mMin:0,mMax:5,sMin:0,sMax:5}, next:null },
  { id:"chaos_avatar", priority:3, title:"混沌の化身", rank:"UR", comment:"攻めと受けの両極を併せ持つ危険領域。", match:{mMin:95,mMax:99,sMin:95,sMax:99}, next:null },

  { id:"chaos_1", priority:4, title:"混沌予備軍", rank:"SR", comment:"SとMの両方の兆候が強くなり始めている。", match:{mMin:70,mMax:76,sMin:70,sMax:76}, next:{title:"混沌の住人", targetM:78, targetS:78} },
  { id:"chaos_2", priority:4, title:"混沌の住人", rank:"SSR", comment:"攻めと受けの境界が曖昧な特殊タイプ。", match:{mMin:78,mMax:84,sMin:78,sMax:84}, next:{title:"深淵の住人", targetM:85, targetS:85} },
  { id:"chaos_3", priority:4, title:"深淵の住人", rank:"SSR", comment:"極端な状況でも楽しめる深層領域。", match:{mMin:85,mMax:89,sMin:85,sMax:89}, next:{title:"超越者", targetM:90, targetS:90} },
  { id:"chaos_4", priority:4, title:"超越者", rank:"UR", comment:"SとMの概念を超えた境地。", match:{mMin:90,mMax:94,sMin:90,sMax:94}, next:{title:"混沌神", targetM:95, targetS:95} },

  { id:"neutral_1", priority:5, title:"一般人", rank:"C", comment:"特に強いS/M傾向はない平均型。", match:{mMin:0,mMax:39,sMin:0,sMax:39}, next:null },
  { id:"neutral_2", priority:5, title:"常識人", rank:"C", comment:"バランスの取れた安定思考。", match:{mMin:40,mMax:44,sMin:40,sMax:44}, next:null },
  { id:"neutral_3", priority:5, title:"バランサー", rank:"R", comment:"状況によって立場を変えられる柔軟型。", match:{mMin:48,mMax:52,sMin:48,sMax:52}, next:null },
  { id:"neutral_4", priority:5, title:"駆け引き上手", rank:"SR", comment:"相手や状況を見て立ち回るタイプ。", match:{mMin:53,mMax:60,sMin:53,sMax:60}, next:null },
  { id:"neutral_5", priority:5, title:"策略家", rank:"SSR", comment:"感情よりも状況分析を優先する戦略思考。", match:{mMin:61,mMax:70,sMin:61,sMax:70}, next:null },

  { id:"m_1", priority:6, title:"ちょいM", rank:"C", comment:"軽く受け身寄りな気質。", match:{mMin:40,mMax:44,sMin:0,sMax:100}, next:{title:"若干M", targetM:45} },
  { id:"m_2", priority:6, title:"若干M", rank:"R", comment:"相手に流れを任せることが多い。", match:{mMin:45,mMax:49,sMin:0,sMax:100}, next:{title:"そこそこM", targetM:50} },
  { id:"m_3", priority:6, title:"そこそこM", rank:"R", comment:"プレッシャーや試練を前向きに受け止めるタイプ。", match:{mMin:50,mMax:59,sMin:0,sMax:100}, next:{title:"ドM予備軍", targetM:60} },
  { id:"m_4", priority:6, title:"ドM予備軍", rank:"SR", comment:"追い込まれる状況に少し楽しさを感じ始めている。", match:{mMin:60,mMax:69,sMin:0,sMax:100}, next:{title:"ドM", targetM:70} },
  { id:"m_5", priority:6, title:"ドM", rank:"SR", comment:"プレッシャーの中で本領を発揮するタイプ。", match:{mMin:70,mMax:79,sMin:0,sMax:100}, next:{title:"筋金入りドM", targetM:80} },
  { id:"m_6", priority:6, title:"筋金入りドM", rank:"SSR", comment:"困難すら楽しみに変える精神耐久型。", match:{mMin:80,mMax:84,sMin:0,sMax:100}, next:{title:"受けの達人", targetM:85} },
  { id:"m_7", priority:6, title:"受けの達人", rank:"SSR", comment:"受け身の状況を理解し楽しめる熟練者。", match:{mMin:85,mMax:89,sMin:0,sMax:100}, next:{title:"受けの神", targetM:90} },
  { id:"m_8", priority:6, title:"受けの神", rank:"UR", comment:"どんな状況でも受け止める圧倒的耐久。", match:{mMin:90,mMax:94,sMin:0,sMax:100}, next:{title:"究極のドM", targetM:100, targetS:0} },

  { id:"s_1", priority:6, title:"ちょいS", rank:"C", comment:"軽く主導権を握るのが好き。", match:{mMin:0,mMax:100,sMin:40,sMax:44}, next:{title:"若干S", targetS:45} },
  { id:"s_2", priority:6, title:"若干S", rank:"R", comment:"会話や駆け引きで自然と主導側に回る。", match:{mMin:0,mMax:100,sMin:45,sMax:49}, next:{title:"そこそこS", targetS:50} },
  { id:"s_3", priority:6, title:"そこそこS", rank:"R", comment:"相手の反応を見ることを楽しむタイプ。", match:{mMin:0,mMax:100,sMin:50,sMax:59}, next:{title:"ドS予備軍", targetS:60} },
  { id:"s_4", priority:6, title:"ドS予備軍", rank:"SR", comment:"追い詰める駆け引きに楽しさを感じ始めている。", match:{mMin:0,mMax:100,sMin:60,sMax:69}, next:{title:"ドS", targetS:70} },
  { id:"s_5", priority:6, title:"ドS", rank:"SR", comment:"相手を追い詰めるほど楽しさを感じるタイプ。", match:{mMin:0,mMax:100,sMin:70,sMax:79}, next:{title:"筋金入りドS", targetS:80} },
  { id:"s_6", priority:6, title:"筋金入りドS", rank:"SSR", comment:"状況をコントロールする支配型。", match:{mMin:0,mMax:100,sMin:80,sMax:84}, next:{title:"支配の達人", targetS:85} },
  { id:"s_7", priority:6, title:"支配の達人", rank:"SSR", comment:"相手の行動を巧みに操る戦略家。", match:{mMin:0,mMax:100,sMin:85,sMax:89}, next:{title:"シハイ神", targetS:90} },
  { id:"s_8", priority:6, title:"シハイ神", rank:"UR", comment:"気づけば周囲の主導権を握っている存在。", match:{mMin:0,mMax:100,sMin:90,sMax:94}, next:{title:"絶対魔王", targetS:100, targetM:0} }
];

export function matchTitle(row, mPercent, sPercent) {
  return (
    mPercent >= row.match.mMin &&
    mPercent <= row.match.mMax &&
    sPercent >= row.match.sMin &&
    sPercent <= row.match.sMax
  );
}

export function getTitleResult(mPercent, sPercent) {
  for (const row of TITLE_TABLE) {
    if (matchTitle(row, mPercent, sPercent)) return row;
  }
  return {
    id: "fallback",
    priority: 999,
    title: "一般人",
    rank: "C",
    comment: "特に強いS/M傾向はない平均型。",
    match: { mMin: 0, mMax: 100, sMin: 0, sMax: 100 },
    next: null
  };
}
