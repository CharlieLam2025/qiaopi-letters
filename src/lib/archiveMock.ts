// 12 条侨批原件库示例数据。
// ⚠ 全部为本项目原创撰写，仿照真实侨批的体例、用语、年代背景，
//   但不对应任何具体馆藏档案；不使用真实批局编号、真实人物姓名。
//   若要将其替换为真实档案，请使用具备授权的来源（侨批档案馆等）。

import type { ArchiveImage, QiaopiItem } from "./archiveTypes";

// 所有占位图都走 SVG 生成器；接入真实图床后只需替换 url
function placeholderImages(): ArchiveImage[] {
  return [
    { kind: "envelope-front", label: "信封正面", url: "generated:envelope-front" },
    { kind: "envelope-back", label: "信封背面", url: "generated:envelope-back" },
    { kind: "letter", label: "内信", url: "generated:letter" },
    { kind: "remittance", label: "汇款凭证", url: "generated:remittance" },
  ];
}

const SOURCE = {
  sourceName: "本站示例（仿照侨批文体撰写，非真实馆藏）",
  sourceUrl: "",
  rightsNote:
    "本条目为示例占位，由本项目原创，未对应任何真实档案；如需用于研究，请参照真实侨批档案馆的授权数据。",
};

export const MOCK_ARCHIVE_ITEMS: QiaopiItem[] = [
  // ---------- 1 ----------
  {
    id: "qp-001",
    title: "致阿母书 · 寄叻银十二元",
    year: "1928",
    dateText: "戊辰年冬月初十",
    fromCountry: "新加坡",
    fromCity: "牛车水",
    toProvince: "广东",
    toCity: "潮安",
    toVillage: "彩塘乡",
    sender: "陈阿成",
    receiver: "陈林氏",
    receiverRelation: "母亲",
    amount: "12",
    currency: "叻币",
    qiaopiOffice: "未注明（示例)",
    themes: ["报平安", "汇款"],
    images: placeholderImages(),
    transcription:
      "阿母大人膝下\n敬禀者\n儿离家已三载未尝省视\n今寄叻银十二元\n祈代收讫\n家中冬衣尚足否\n小妹学堂之资\n亦请阿母酌定\n儿在叻地寝食皆安\n惟思家心切\n夜不能寐\n敬颂福安\n儿 阿成 谨上",
    modernExplanation:
      "阿成离家已经三年没回过家。这次从新加坡寄回十二元叻币，托母亲代为收讫。他询问母亲冬衣是否足够，又关心小妹的学费，请母亲酌情安排。他说自己在新加坡生活安稳，只是想家心切，常常夜里睡不着。",
    historicalNotes:
      "叻币（Straits Dollar）是 1898—1939 年间英属海峡殖民地通行的官方货币，新加坡、马六甲、槟城均通用，是早期下南洋潮汕、闽南侨民最熟悉的钱币之一。1928 年（戊辰年）属南洋经济相对平稳期，潮汕侨乡每月可收一两次南来侨批，是留守家庭的重要经济来源。'寝不安席、夜不能寐' 是侨批中极常见的套语。",
    ...SOURCE,
  },

  // ---------- 2 ----------
  {
    id: "qp-002",
    title: "致家父书 · 时局多艰寄银十八元",
    year: "1935",
    dateText: "乙亥年六月十六",
    fromCountry: "马来亚",
    fromCity: "槟城",
    toProvince: "福建",
    toCity: "泉州",
    toVillage: "安溪上垄",
    sender: "黄炳坤",
    receiver: "黄忠厚",
    receiverRelation: "父亲",
    amount: "18",
    currency: "大洋",
    qiaopiOffice: "槟城某批信局（示例)",
    themes: ["汇款", "家事"],
    images: placeholderImages(),
    transcription:
      "父亲大人膝下\n儿炳坤敬禀\n昨接来书 知家中收成欠佳\n甚为忧念\n今寄大洋十八元\n内中四元 留作母亲药资\n余款请父亲斟酌支配\n小弟应入塾 望勿断其学\n南洋时局亦多艰\n惟儿身体安康\n餐饮尚足\n请勿过虑\n儿 炳坤 敬上",
    modernExplanation:
      "炳坤收到父亲的信，知道家里今年收成不好。这次寄回十八元大洋，其中四元专给母亲买药，剩下的请父亲灵活分配。他特别叮嘱：小弟该上学了，无论如何不要让他失学。又说南洋时局也不太平，但自己身体安好，请家里不要担心。",
    historicalNotes:
      "1935 年福建侨乡正经历多次旱涝交替，安溪一带常以南洋汇款补贴生计。'大洋' 是民国时期流通的银元，与南洋叻币、香港币之间通过批局换汇。槟城是南洋华侨重镇，福建闽南人聚居极众。侨批中常出现 '勿断学业' 的嘱托，可见侨民对家中后辈教育的极度看重。",
    ...SOURCE,
  },

  // ---------- 3 ----------
  {
    id: "qp-003",
    title: "致内子书 · 一别十年",
    year: "1948",
    dateText: "民国卅七年九月十二日",
    fromCountry: "印度尼西亚",
    fromCity: "雅加达",
    toProvince: "海南",
    toCity: "文昌",
    toVillage: "翁田乡",
    sender: "符德昌",
    receiver: "符吴氏",
    receiverRelation: "妻子",
    amount: "30",
    currency: "国币",
    qiaopiOffice: "巴城批信局（示例)",
    themes: ["想念", "汇款"],
    images: placeholderImages(),
    transcription:
      "贤妻吴氏如晤\n自卯年一别 今已十载\n盼归未归 实非所愿\n此地战后初定 商务渐起\n然回程舟船尚不可恃\n今寄国币三十元\n请兑成大洋使用\n家中老母 望多加照料\n小儿入塾 学费亦请勿吝\n余惟祝阖家安康\n夫 德昌",
    modernExplanation:
      "德昌写给妻子吴氏：我们一别已经十年，我一直想回家，但回不去。雅加达战后局势刚刚稳定，生意才慢慢恢复，可是回乡的船仍然不可靠。这次寄回三十元国币，请兑换成大洋使用。家中老母亲请你多照顾，小儿子上学的学费也不要省。",
    historicalNotes:
      "1948 年的雅加达（旧称 '巴城'）刚经历二战与战后政权更替，华侨与家乡的联系长期中断，1947 年起逐步恢复。海南文昌是著名侨乡之一，许多家庭的男性长年在南洋谋生。'卯年一别 今已十载' 是侨批常见的叙述方式，时间多按干支纪年标记。",
    ...SOURCE,
  },

  // ---------- 4 ----------
  {
    id: "qp-004",
    title: "致二兄书 · 议立家祠",
    year: "1922",
    dateText: "壬戌年三月二十",
    fromCountry: "暹罗",
    fromCity: "曼谷",
    toProvince: "广东",
    toCity: "揭阳",
    toVillage: "霖磐都",
    sender: "林伯卿",
    receiver: "林仲卿",
    receiverRelation: "兄长",
    amount: "8",
    currency: "银元",
    qiaopiOffice: "暹罗某批馆（示例)",
    themes: ["宗族", "家事"],
    images: placeholderImages(),
    transcription:
      "二兄如晤\n顷悉宗族议立家祠\n弟身居海外 不能与议\n然每念祖宗祠堂事关重大\n理当尽心\n今寄银元八枚\n权作捐资\n若需添贴\n弟当再寄\n祭祖之日\n望兄代弟焚香一炷\n弟 伯卿 敬上",
    modernExplanation:
      "伯卿写给二哥：听说族里要建家祠，自己人在暹罗（泰国）参与不了。但祠堂的事非同小可，理应尽一份心力，所以寄回八枚银元当作捐款。如果钱不够，可以再寄。祭祖那天，请兄长替自己焚一炷香。",
    historicalNotes:
      "民国初年潮汕宗族修建家祠之风盛行，海外华侨多以捐资方式参与。曼谷是南洋潮汕侨民的主要聚集地，同乡会与批馆关系密切。'家祠捐资' 是侨批中常见的题目，体现海外侨民对宗族认同感的延续。",
    ...SOURCE,
  },

  // ---------- 5 ----------
  {
    id: "qp-005",
    title: "母亲大人膝下 · 时局难料",
    year: "1941",
    dateText: "辛巳年八月初一",
    fromCountry: "越南",
    fromCity: "西贡",
    toProvince: "广东",
    toCity: "梅县",
    toVillage: "丙村",
    sender: "李子轩",
    receiver: "李曾氏",
    receiverRelation: "母亲",
    amount: "",
    currency: "",
    qiaopiOffice: "西贡批信局（示例)",
    themes: ["告别", "抗战"],
    images: placeholderImages(),
    transcription:
      "母亲大人膝下\n儿不孝\n半年未寄一信\n非不思家 实形势所迫\n此地日舰频出\n邮路屡断\n今托舟船捎此一信\n不知能否寄达\n近来生意停顿\n银钱不便\n故无款奉上\n唯祈母亲珍重\n儿性命未损\n若再不通信\n亦勿过虑\n儿 子轩 拜上",
    modernExplanation:
      "子轩写给母亲：自己半年没寄信，不是不想家，而是局势所迫——西贡这边日本军舰频繁出没，邮路常常中断。这次托船带回这封信，不确定能不能到。生意停了，钱不便寄，所以这次没有附款。希望母亲保重；自己还活着，如果以后再没消息，也请不要太担心。",
    historicalNotes:
      "1941 年日本势力南侵，越南西贡、新加坡、马来亚等地华侨与家乡的通信日益困难，年底太平洋战争爆发后批信几近断绝。梅县客家是著名侨乡之一，1930—40 年代不少梅县青年远赴印支半岛谋生。这一时期的侨批多以 '勿过虑'、'性命无损' 反复劝慰，留下了战争阴影的痕迹。",
    ...SOURCE,
  },

  // ---------- 6 ----------
  {
    id: "qp-006",
    title: "致阿嬷 · 久未承欢",
    year: "1952",
    dateText: "壬辰年六月十一",
    fromCountry: "菲律宾",
    fromCity: "马尼拉",
    toProvince: "福建",
    toCity: "厦门",
    toVillage: "鼓浪屿龙头路",
    sender: "庄敬贤",
    receiver: "庄陈氏",
    receiverRelation: "祖母",
    amount: "100",
    currency: "港币",
    qiaopiOffice: "经香港转汇（示例)",
    themes: ["想念", "汇款"],
    images: placeholderImages(),
    transcription:
      "阿嬷大人膝下\n孙敬贤敬上\n久未承欢膝下\n心中常有愧意\n今寄港币壹百元\n经香港转汇\n请阿嬷收讫\n鼓浪屿日来天热\n祈阿嬷多饮凉茶\n午后勿独行\n孙在马尼拉一切平安\n工作如常\n惟念阿嬷之心\n日日不减\n孙 敬贤 谨上",
    modernExplanation:
      "敬贤写给祖母：好久没回家陪您，心里一直觉得愧疚。这次寄回一百港币，是经香港转过来的，请您收下。鼓浪屿夏天热，多喝凉茶，下午别一个人出门。自己在马尼拉一切都好，工作如常，但想您的心情，一天也没减。",
    historicalNotes:
      "1949 年后，由于政治原因，侨批多数通过香港转账抵达大陆侨乡。鼓浪屿是著名的'万国建筑'侨乡之一，华侨来往频繁。'港币' 在战后逐步取代叻币、国币，成为侨乡接收侨汇时最常见的货币。'承欢膝下' 是传统家书惯用语，表达晚辈未能侍奉长辈的歉意。",
    ...SOURCE,
  },

  // ---------- 7 ----------
  {
    id: "qp-007",
    title: "致家父书 · 初下南洋之报",
    year: "1908",
    dateText: "戊申年正月廿三",
    fromCountry: "新加坡",
    fromCity: "丝丝街",
    toProvince: "广东",
    toCity: "汕头",
    toVillage: "鮀浦都",
    sender: "郑亦云",
    receiver: "郑鹤峰",
    receiverRelation: "父亲",
    amount: "6",
    currency: "大洋",
    qiaopiOffice: "永泰批馆（示例性命名)",
    themes: ["学业", "报平安"],
    images: placeholderImages(),
    transcription:
      "父亲大人膝下\n儿亦云敬禀\n舟行廿七日 始抵叻埠\n途中颠簸 风浪屡作\n所幸无恙\n现寓族叔阿铭店中\n日间帮工\n夜则读书\n每月可得工银八元\n今寄大洋六元\n祈父亲收讫\n小弟学业 万勿懈怠\n家中母亲身体如何\n甚念\n儿 亦云 谨上",
    modernExplanation:
      "亦云第一次写信给父亲：船在海上走了二十七天才到新加坡，一路风浪颠簸，所幸平安。现在住在本家叔叔阿铭的店里，白天打工，晚上读书。每月能挣八元工银，这次寄回大洋六元。请父亲不要让弟弟荒废学业，又问候母亲身体如何，十分挂念。",
    historicalNotes:
      "清末民初南来的潮汕人多投奔同乡同族开设的商号，'白天帮工、晚上读书' 是早期侨民常见的处境。1908 年从汕头到新加坡的航程约二十多日，乘的多是 '红头船' 或英国船公司的客货船。'丝丝街'（今 Cecil Street 一带）是新加坡早期潮商聚集地之一。",
    ...SOURCE,
  },

  // ---------- 8 ----------
  {
    id: "qp-008",
    title: "致内子书 · 此身报国 钱寄家",
    year: "1937",
    dateText: "丁丑年八月十六",
    fromCountry: "马来亚",
    fromCity: "槟城",
    toProvince: "福建",
    toCity: "漳州",
    toVillage: "海澄",
    sender: "吴启明",
    receiver: "吴蔡氏",
    receiverRelation: "妻子",
    amount: "20",
    currency: "大洋",
    qiaopiOffice: "槟城批信局（示例)",
    themes: ["抗战", "汇款"],
    images: placeholderImages(),
    transcription:
      "贤妻如晤\n近闻祖国战事日急\n南洋侨众皆起捐输\n吾已联名认捐三十元\n另寄家用大洋廿元\n请勿少之\n家中老母 务请奉养\n小儿 望勿断其学\n战事胶着\n归期未定\n此身或先报国\n钱则先寄家\n夫 启明 上",
    modernExplanation:
      "启明写给妻子：祖国战事吃紧，南洋华侨纷纷捐款。自己也联名认捐了三十元，另外寄回家用二十元，请你不要嫌少。家中老母务必奉养，小儿子的学业更不能断。战事胶着，归期没有指望——'这一身或许先报国，钱则先寄家'。",
    historicalNotes:
      "1937 年抗战全面爆发，南洋华侨发起 '抵制日货、捐资救国' 运动。槟城与新加坡的福建侨众成立了多种 '筹赈会'，许多侨民按月按薪自愿认捐。此后数年，南洋侨汇被大量分流为 '义款'，许多家庭因此一度收不到家用。",
    ...SOURCE,
  },

  // ---------- 9 ----------
  {
    id: "qp-009",
    title: "致大哥 · 借款议婚事",
    year: "1915",
    dateText: "乙卯年腊月初九",
    fromCountry: "荷属东印度",
    fromCity: "泗水",
    toProvince: "广东",
    toCity: "嘉应州",
    toVillage: "松口",
    sender: "罗瑞祥",
    receiver: "罗瑞昌",
    receiverRelation: "兄长",
    amount: "15",
    currency: "银元",
    qiaopiOffice: "泗水某批馆（示例)",
    themes: ["家事", "宗族"],
    images: placeholderImages(),
    transcription:
      "瑞昌大兄如晤\n弟去年所议婚事\n今春可定\n惟一应聘礼诸事\n家中或有不足\n今寄银元十五枚\n权作初步使用\n若仍不敷\n祈兄先行垫付\n弟当年内补足\n此乃终身大事\n弟在外 不便亲理\n全仗大兄 费心料理\n不敢忘恩\n弟 瑞祥 敬上",
    modernExplanation:
      "瑞祥写给大哥：去年商议的婚事今年春天可以办了。聘礼一类的开支家里可能不太够，先寄回十五块银元做初步用。如果还不够，请大兄先垫上，自己年内会补齐。这是终身大事，自己在外不方便亲理，全靠大兄操心。",
    historicalNotes:
      "嘉应州（民国后改称梅县）是客家人主要聚居地，下南洋的客家人极多。荷属东印度泗水是早期客家商人的重要据点。在通信不便的年代，海外侨民的婚事多由家中兄长代为操办，'议婚事' '托兄办理' 在侨批里并不少见。",
    ...SOURCE,
  },

  // ---------- 10 ----------
  {
    id: "qp-010",
    title: "致内子书 · 战后初通",
    year: "1946",
    dateText: "民国卅五年五月初八",
    fromCountry: "新加坡",
    fromCity: "新加坡市",
    toProvince: "广东",
    toCity: "汕头",
    toVillage: "鮀濟乡",
    sender: "黄景昌",
    receiver: "黄陈秀英",
    receiverRelation: "妻子",
    amount: "50",
    currency: "叻币",
    qiaopiOffice: "战后批信局（示例)",
    themes: ["报平安", "汇款"],
    images: placeholderImages(),
    transcription:
      "秀英 如晤\n战事既歇\n邮路新通\n急以一函相告\n吾平安无恙\n日寇陷叻地三载\n吾时藏时露\n所幸性命无虞\n今寄叻币五十元\n请兑大洋使用\n家中三载未通音问\n不知母亲身体如何\n小儿想已识字\n盼速回信\n夫 景昌",
    modernExplanation:
      "景昌写给妻子：战争结束了，邮路重新通了，急忙写信报平安。日寇占领新加坡三年，自己时而躲藏时而露面，所幸性命没事。这次寄回叻币五十元，请兑成大洋使用。家里三年没有消息，不知道母亲身体如何，小儿子想必也认字了，盼她赶快回信。",
    historicalNotes:
      "1942—1945 年新加坡沦陷期间，南洋至中国的侨批几乎全部中断。1946 年起陆续恢复，许多家庭这才得知亲人下落，'战后初通' 类的侨批往往字字千钧。1939 年起叻币已被海峡币、马来亚币等取代，但侨乡习惯仍称其为 '叻币'。",
    ...SOURCE,
  },

  // ---------- 11 ----------
  {
    id: "qp-011",
    title: "致三弟 · 望尔成名",
    year: "1925",
    dateText: "乙丑年九月初三",
    fromCountry: "越南",
    fromCity: "堤岸",
    toProvince: "广东",
    toCity: "五华",
    toVillage: "歧岭",
    sender: "邹景文",
    receiver: "邹景德",
    receiverRelation: "弟",
    amount: "20",
    currency: "大洋",
    qiaopiOffice: "堤岸某批馆（示例)",
    themes: ["学业", "汇款"],
    images: placeholderImages(),
    transcription:
      "三弟景德\n来函已悉\n得知尔入县学\n兄甚慰\n今寄大洋廿元\n专作尔学费\n余如有缺\n当再寄之\n读书一事 切勿懒怠\n家中虽贫\n书不可不读\n他日若能成名\n方不负此漂洋之苦\n兄 景文 谆嘱",
    modernExplanation:
      "景文写给三弟：信收到了，知道你考进县学，兄长很欣慰。这次寄回大洋二十元，专做你的学费，如果还有不够再寄。读书这件事千万别偷懒——家里虽穷，书不能不读；将来若能出息，才不辜负哥哥在海外漂泊的辛苦。",
    historicalNotes:
      "堤岸（Cholon）是越南西贡的华人区，潮州、客家、广府侨民混居。五华、丰顺、揭西的客家人在堤岸做生意者甚多。许多侨民将海外辛苦所得寄回家中，专项支持族弟、子侄读书，'供书' 是当时侨乡常见的家庭安排。",
    ...SOURCE,
  },

  // ---------- 12 ----------
  {
    id: "qp-012",
    title: "母亲大人膝下 · 红头船报",
    year: "1893",
    dateText: "光绪十九年三月廿八",
    fromCountry: "海峡殖民地",
    fromCity: "槟榔屿",
    toProvince: "福建",
    toCity: "兴化府",
    toVillage: "莆田江口",
    sender: "林桂泉",
    receiver: "林郑氏",
    receiverRelation: "母亲",
    amount: "4",
    currency: "番银",
    qiaopiOffice: "兴化批信局（示例性命名)",
    themes: ["报平安"],
    images: placeholderImages(),
    transcription:
      "母亲大人膝下\n儿桂泉敬禀\n去年腊月廿一登舟\n今年正月十六抵岛\n舟行廿六日\n风浪殊大\n所幸无恙\n现寄居乡叔阿砌店中\n日间贩布于市\n夜宿店阁\n每月所得 仅敷食用\n今寄番银四元\n聊表寸心\n余惟祈母亲珍重\n儿 桂泉 拜上",
    modernExplanation:
      "桂泉第一次给母亲写信：去年腊月二十一登船，今年正月十六到岛上，整整二十六天，海上风浪很大，幸好平安。现在住在同乡叔叔阿砌的店里，白天上街卖布，晚上睡店阁楼。每月所赚只够吃饭，这次寄回番银四元，聊表心意。",
    historicalNotes:
      "'红头船' 是 19 世纪福建、广东沿海通往南洋的著名木帆船，因船头漆红而得名。光绪十九年（1893）下南洋多取道槟榔屿（Penang）、新加坡。'番银' 是清末侨乡对海外银元的通称，1 番银约合 0.72—0.8 两白银。莆田兴化是福建主要侨乡之一，福州、兴化、闽南三系侨民下南洋的路径各有差异。",
    ...SOURCE,
  },

  // ---------- 13 ----------
  {
    id: "qp-013",
    title: "致岳父大人 · 婿初到槟榔屿",
    year: "1855",
    dateText: "咸丰五年八月廿二",
    fromCountry: "海峡殖民地",
    fromCity: "槟榔屿",
    toProvince: "广东",
    toCity: "潮州",
    toVillage: "庵埠",
    sender: "蔡承宗",
    receiver: "黄玉书",
    receiverRelation: "岳父",
    amount: "3",
    currency: "番银",
    qiaopiOffice: "未注明（早期水客寄递·示例)",
    themes: ["报平安"],
    images: placeholderImages(),
    transcription:
      "岳父大人钧鉴\n婿承宗敬禀\n本年三月辞行\n八月初到槟榔屿\n海上风涛连日不息\n所幸性命无恙\n现寄居岳兄铺中\n日则督工\n夜则记账\n人事虽生 处境尚安\n今奉番银三元\n请岳父代购供奉之物\n余请阿英照料家中诸事\n余不一一\n婿 承宗 谨上",
    modernExplanation:
      "承宗婚后不久就下南洋谋生。这年三月辞别岳父，八月才到槟城，海上一路风浪。他寄居在妻舅的铺子里，白天督导工人，晚上记账。还不熟悉环境，但生活安定。寄回番银三元，请岳父代为操办家中的供奉之物。也托妻子阿英照看家事。",
    historicalNotes:
      "咸丰年间（1850s）潮汕一带因小刀会与红巾起义余波，人口外流加速。槟榔屿因英殖民地相对安稳成为潮汕、闽南人最早的目的地。'婿' 自称与 '岳父大人钧鉴' 的搭配是当时常见的旧式书信结构。这一时期尚未有成熟的批局体系，多由水客（兼商船跑货）私人转寄。",
    ...SOURCE,
  },

  // ---------- 14 ----------
  {
    id: "qp-014",
    title: "致三弟 · 戒烟劝学",
    year: "1898",
    dateText: "光绪二十四年十一月初九",
    fromCountry: "越南",
    fromCity: "堤岸",
    toProvince: "广东",
    toCity: "雷州",
    toVillage: "海康",
    sender: "陈维藩",
    receiver: "陈维炳",
    receiverRelation: "弟",
    amount: "10",
    currency: "大洋",
    qiaopiOffice: "堤岸某批馆（示例)",
    themes: ["家事", "学业"],
    images: placeholderImages(),
    transcription:
      "三弟维炳\n来信悉知\n闻尔近来时与烟徒交往\n兄心甚忧\n大烟一物 误人性命\n切勿沾染\n今寄大洋十元\n半作家用\n半作尔学费\n望尔潜心读书\n勿负兄望\n他日若能成器\n方不辜负父母教养之恩\n兄维藩 谆嘱",
    modernExplanation:
      "维藩从堤岸（西贡华人区）写信劝告三弟戒烟向学：听说弟弟最近和抽鸦片的人来往，他非常担忧。叮嘱'大烟误人性命，切勿沾染'。寄回十元大洋，一半家用一半作学费，盼弟弟用功读书。",
    historicalNotes:
      "清末民初鸦片烟毒在沿海乡村泛滥，海外侨民写信劝戒亲人是侨批中常见主题。堤岸（Cholon）是越南南圻华人聚居区，潮州、客家、广府兼有。雷州半岛在民国时期亦是侨民输出地之一，多前往越南、暹罗谋生。",
    ...SOURCE,
  },

  // ---------- 15 ----------
  {
    id: "qp-015",
    title: "致内子 · 闻儿出生",
    year: "1907",
    dateText: "光绪三十三年二月初六",
    fromCountry: "暹罗",
    fromCity: "曼谷",
    toProvince: "广东",
    toCity: "海丰",
    toVillage: "梅陇",
    sender: "丘谦益",
    receiver: "丘陈氏",
    receiverRelation: "妻子",
    amount: "20",
    currency: "银元",
    qiaopiOffice: "暹京水客（示例)",
    themes: ["家事", "汇款"],
    images: placeholderImages(),
    transcription:
      "贤妻如晤\n接来信 知尔已得一子\n暹京华侨闻之 皆为夫贺\n夫在外漂泊七载\n今得儿息 心慰非常\n名讳一事 望兄代取\n务必稳重\n今寄银元廿枚\n请兑大洋使用\n半作产后调养\n半作儿洗三礼资\n勿过节俭\n夫 谦益 谨上",
    modernExplanation:
      "谦益接到妻子来信，得知孩子已经出生。漂泊七年，终于得到儿子，他非常高兴。孩子的名字请兄长代为商量取定。这次寄回二十枚银元，一半给妻子产后调养，一半作小孩满月（洗三）礼资，叮嘱别太省。",
    historicalNotes:
      "曼谷（暹罗京城）是潮汕、海陆丰客家人下南洋的主要目的地。'洗三'是华南婴儿出生第三天的浴婴仪式，需备红蛋、礼银、礼饼宴客。'兑大洋使用'反映了民国前后侨乡多用大洋而非银元，需在批局兑换。",
    ...SOURCE,
  },

  // ---------- 16 ----------
  {
    id: "qp-016",
    title: "致家父 · 开杂货铺事",
    year: "1916",
    dateText: "民国五年闰二月十五",
    fromCountry: "缅甸",
    fromCity: "仰光",
    toProvince: "福建",
    toCity: "龙岩",
    toVillage: "适中",
    sender: "罗启明",
    receiver: "罗永福",
    receiverRelation: "父亲",
    amount: "25",
    currency: "卢比",
    qiaopiOffice: "仰光闽侨批馆（示例)",
    themes: ["商务", "家事"],
    images: placeholderImages(),
    transcription:
      "父亲大人膝下\n儿启明敬禀\n违教二年 思家颇切\n仰光物价日昂\n华人多以小本起家\n儿与堂兄合资\n开设杂货铺一爿\n规模虽小 生意尚可\n月得净银约廿元\n今寄缅卢比廿五元\n请兑大洋使用\n家中田事\n仍仰父亲指点\n儿 启明 敬上",
    modernExplanation:
      "启明在缅甸仰光与堂兄合开杂货铺，规模虽小，月入约二十元净银。这次寄回缅甸卢比二十五元，请家里兑成大洋使用。家里的田地诸事还是依靠父亲指点。",
    historicalNotes:
      "缅甸仰光是闽南、客家侨民另一个重要落脚点，福建龙岩、漳州、漳浦人较多。20 世纪初仰光华人多经营杂货、米粮、布匹。'闰二月' 是阴历闰月，民国五年（1916）确有闰二月。卢比是当时英属缅甸通货，与海峡币、印度卢比可兑换。",
    ...SOURCE,
  },

  // ---------- 17 ----------
  {
    id: "qp-017",
    title: "致大父 · 异邦中秋",
    year: "1923",
    dateText: "民国十二年八月十四",
    fromCountry: "美国",
    fromCity: "檀香山",
    toProvince: "广东",
    toCity: "台山",
    toVillage: "白沙",
    sender: "黄炳枢",
    receiver: "黄文耀",
    receiverRelation: "祖父",
    amount: "50",
    currency: "美金",
    qiaopiOffice: "金山批馆 · 经港转汇（示例)",
    themes: ["想念", "汇款"],
    images: placeholderImages(),
    transcription:
      "大父大人膝下\n孙炳枢敬禀\n明日中秋\n金山亦有华侨结社\n备月饼茗茶\n聊解乡思\n然异邦风物\n终不如家中竹笋甘\n孙在洗衣坊已三载\n月给十二元\n今寄美金五十元\n经港转汇\n请大父收讫\n余以二十作家用\n余三十作大父寿仪\n大父七秩在即\n孙不能亲拜\n惟以此聊申孝意",
    modernExplanation:
      "炳枢在美国檀香山（夏威夷）一家洗衣店打工三年，月薪十二美元。中秋将近，他写信给祖父：当地华人也办中秋会，备月饼茶水以解乡愁，但终究不如家乡风味。寄回五十美元，二十作家用，三十给祖父做七十大寿的寿仪。",
    historicalNotes:
      "广东台山（旧称新宁）是 19 世纪末至 20 世纪美洲华侨的主要原乡之一。檀香山（Honolulu）和旧金山是台山人最早的两个目的地，多从事洗衣、餐饮、菜园生意。寿仪与家用分项寄递、托香港转汇是金山批的典型样式。1923 年美国《排华法案》尚在执行，台山人多以未婚单身工人身份滞留。",
    ...SOURCE,
  },

  // ---------- 18 ----------
  {
    id: "qp-018",
    title: "致内子 · 立春雨水",
    year: "1929",
    dateText: "民国十八年正月廿七",
    fromCountry: "菲律宾",
    fromCity: "马尼拉",
    toProvince: "福建",
    toCity: "晋江",
    toVillage: "石狮",
    sender: "黄世镇",
    receiver: "黄王氏",
    receiverRelation: "妻子",
    amount: "60",
    currency: "比索",
    qiaopiOffice: "马尼拉闽侨批馆（示例)",
    themes: ["想念", "汇款"],
    images: placeholderImages(),
    transcription:
      "贤妻如晤\n立春已过 雨水将临\n岷地此时风暖\n忽忆家中田水未足\n春耕事大\n望贤妻督促长工\n勿误农时\n今寄比索六十元\n请兑大洋使用\n半作春耕\n半作家中老母调养\n小儿乳母之资\n亦请并付\n余不一一\n夫 世镇 上",
    modernExplanation:
      "世镇在马尼拉，立春刚过想到家乡春耕。叮嘱妻子督促长工准备好田水，别误了农时。寄回菲律宾比索六十元，一半作春耕开支，一半给老母调养，乳母的工钱也一并支付。",
    historicalNotes:
      "马尼拉（'岷'是侨乡对菲律宾的简称）的福建晋江、惠安、南安人最多。'立春雨水' 这种以二十四节气切入的开头是 20 世纪前期闽南侨批的典型写法。比索（Peso）是西属、美属时期通货，1929 年约 2 比索兑 1 美金。",
    ...SOURCE,
  },

  // ---------- 19 ----------
  {
    id: "qp-019",
    title: "致堂兄 · 重修宗祠",
    year: "1932",
    dateText: "壬申年九月十一",
    fromCountry: "马来亚",
    fromCity: "怡保",
    toProvince: "广东",
    toCity: "开平",
    toVillage: "百合",
    sender: "司徒永祥",
    receiver: "司徒永发",
    receiverRelation: "堂兄",
    amount: "30",
    currency: "叻币",
    qiaopiOffice: "怡保批信局（示例)",
    themes: ["宗族"],
    images: placeholderImages(),
    transcription:
      "永发堂兄如晤\n顷得来书 知族中议重修宗祠\n弟身居海外\n常念祖宗根本所系\n理当尽心\n今寄叻币三十元\n权作捐资\n若有不足\n弟当再寄\n惟弟一人之力 终属有限\n伏望族中诸长\n再行劝募\n祠堂落成之日\n望兄代弟焚香一炷",
    modernExplanation:
      "永祥写给堂兄：族里要重修宗祠，作为海外族人理应出力。先寄三十叻币，如果不够还可以再寄。一个人能力有限，希望族中长老再向其他海外族人募捐。祠堂落成那天，请堂兄代他焚一炷香。",
    historicalNotes:
      "广东四邑（开平、台山、新会、恩平）以祠堂林立著称，重修祠堂是华侨与原乡最紧密的纽带之一。怡保（Ipoh）是马来亚北部锡矿重镇，1930 年代有大批四邑客家、广府侨民。'祠堂落成之日 望兄代弟焚香一炷' 是侨批中典型的代行祭祖请求。",
    ...SOURCE,
  },

  // ---------- 20 ----------
  {
    id: "qp-020",
    title: "致阿母 · 抗战义款",
    year: "1938",
    dateText: "戊寅年七月初三",
    fromCountry: "新加坡",
    fromCity: "新加坡市",
    toProvince: "福建",
    toCity: "惠安",
    toVillage: "崇武",
    sender: "庄锦标",
    receiver: "庄陈氏",
    receiverRelation: "母亲",
    amount: "15",
    currency: "大洋",
    qiaopiOffice: "新加坡闽侨筹赈批馆（示例)",
    themes: ["抗战", "汇款"],
    images: placeholderImages(),
    transcription:
      "阿母大人膝下\n儿锦标敬禀\n祖国战事日益吃紧\n南侨筹赈会日夜募捐\n儿已认捐月薪一成\n约新币五元\n直缴筹赈\n另寄大洋十五元\n供阿母家用\n请勿少之\n弟尚幼\n望阿母善加抚养\n他日若有不测\n望阿母珍重 勿过悲\n敬颂福安",
    modernExplanation:
      "锦标听说祖国战事吃紧，已经向新加坡南洋华侨筹赈祖国难民总会（南侨总会）按月认捐工资的十分之一（约五新币）。另外寄回家用大洋十五元。弟弟还小，请母亲好好抚养。如果他自己有什么不测，希望母亲珍重不要太悲伤。",
    historicalNotes:
      "1938 年陈嘉庚先生发起组织'南洋华侨筹赈祖国难民总会'（简称'南侨总会'），新马侨众按月按薪认捐成为常规。'若有不测 望阿母珍重 勿过悲' 是该时期侨批中常见的告别预语 —— 许多侨民同时报名加入南侨机工回国服务，'此身或先报国' 的心境弥漫。",
    ...SOURCE,
  },

  // ---------- 21 ----------
  {
    id: "qp-021",
    title: "致妻 · 沦陷代笔",
    year: "1942",
    dateText: "民国卅一年六月（代笔）",
    fromCountry: "马来亚",
    fromCity: "吉隆坡",
    toProvince: "广东",
    toCity: "潮阳",
    toVillage: "棉城",
    sender: "周永泉",
    receiver: "周李氏",
    receiverRelation: "妻子",
    amount: "",
    currency: "",
    qiaopiOffice: "暹罗友人转 · 沦陷期托递（示例)",
    themes: ["告别"],
    images: placeholderImages(),
    transcription:
      "李氏 如晤\n此函由乡友代笔\n吾近半年隐居山中\n日寇搜索华侨甚紧\n所幸性命无虞\n惟商号已废\n银钱无可寄\n望卿与诸子\n暂以家中田产度日\n若实在不济\n可问族中三叔借贷\n吾若三年内无音讯\n勿强寻\n阿婆如已不在\n吾不能尽孝\n望诸子代行\n余不一一",
    modernExplanation:
      "永泉的信是托同乡代笔的（自己可能受伤或不识字）。沦陷期他躲在山里半年，命暂无虞但商铺已废，没钱寄。请妻子靠田产度日，实在不济找族叔借。三年内没消息就别再找他。如果母亲已经过世，他无法尽孝，请儿女代行祭奠。",
    historicalNotes:
      "1942 年初日军占领马来亚，对华侨进行'肃清'屠杀。许多侨民躲入山林，沦陷期侨批几乎全断，少数通过暹罗（泰国）或港、澳辗转转递，常为口述代笔。'三年内无音讯 勿强寻' 是该时期侨批最沉重的语式之一。",
    ...SOURCE,
  },

  // ---------- 22 ----------
  {
    id: "qp-022",
    title: "致兄长 · 战后筹归",
    year: "1947",
    dateText: "民国卅六年十一月初二",
    fromCountry: "越南",
    fromCity: "西贡",
    toProvince: "海南",
    toCity: "琼海",
    toVillage: "嘉积",
    sender: "韩鼎钧",
    receiver: "韩鼎纶",
    receiverRelation: "兄长",
    amount: "40",
    currency: "国币",
    qiaopiOffice: "西贡韩氏批馆（示例)",
    themes: ["报平安", "汇款"],
    images: placeholderImages(),
    transcription:
      "鼎纶大兄如晤\n战事既歇 邮路稍通\n弟廿年羁旅 万念俱灰\n今欲择期归乡 长侍父母膝下\n惟商号未清\n船票紧张\n回程尚需时日\n今先寄国币四十元\n请兄代付家中冬粮米款\n余事容后函详\n敬颂台安",
    modernExplanation:
      "鼎钧战后第一次写信给兄长：在外二十年，一直想回家长侍父母。商号还没清算，船票也紧，但已经计划回乡。先寄国币四十元，请兄长代付家里冬粮米款。其他事下封信再细说。",
    historicalNotes:
      "海南琼海是早期下南洋的重要原乡，多前往越南、海峡殖民地。1945—49 年间归侨潮始起，但船票一票难求，许多侨民筹划数年方能成行。国币（法币）在 1947 年通胀严重，至 1948 年金圆券改革。",
    ...SOURCE,
  },

  // ---------- 23 ----------
  {
    id: "qp-023",
    title: "致阿嬷 · 香港转汇",
    year: "1955",
    dateText: "乙未年三月廿一",
    fromCountry: "香港",
    fromCity: "九龙油麻地",
    toProvince: "福建",
    toCity: "南安",
    toVillage: "丰州",
    sender: "苏国凯",
    receiver: "苏黄氏",
    receiverRelation: "祖母",
    amount: "200",
    currency: "港币",
    qiaopiOffice: "经港某代理商（示例)",
    themes: ["想念", "汇款"],
    images: placeholderImages(),
    transcription:
      "阿嬷大人膝下\n孙国凯敬上\n两年未通音问\n孙在香港制衣厂当工\n日做十二点钟\n寝食尚足\n孙父去年托人捎来阿嬷音讯\n知阿嬷身体尚健\n孙心稍安\n今托代理寄港币二百元\n经厦门转南安\n请阿嬷收讫\n余以一百作家用\n以一百为阿嬷添置薄棉袄\n莫嫌迟\n孙 国凯 谨上",
    modernExplanation:
      "国凯 1955 年在香港制衣厂打工，每天工作十二小时。两年没和家里通信，今天托代理商寄回港币二百元到福建南安：一百块作家用，一百块给祖母买件厚棉袄。",
    historicalNotes:
      "1950—70 年代海外华侨向大陆的汇款大都经香港'侨汇'代理人转递。福建南安、晋江、惠安一带是接收侨汇的核心区，'丰州''诗山'等老镇多设代办处。'莫嫌迟' 是侨乡常见的歉意结尾，反映了战后中断—复通的家庭普遍处境。",
    ...SOURCE,
  },

  // ---------- 24 ----------
  {
    id: "qp-024",
    title: "致内子 · 万隆事变",
    year: "1958",
    dateText: "戊戌年九月十二",
    fromCountry: "印度尼西亚",
    fromCity: "万隆",
    toProvince: "福建",
    toCity: "龙海",
    toVillage: "石码",
    sender: "蔡书贤",
    receiver: "蔡苏氏",
    receiverRelation: "妻子",
    amount: "80",
    currency: "盾",
    qiaopiOffice: "万隆华侨互助会（示例)",
    themes: ["告别", "家事"],
    images: placeholderImages(),
    transcription:
      "贤妻如晤\n此地政局多变\n华侨商业亦多受限\n吾之布庄已歇业三月\n生计渐紧\n今寄印尼盾八十元\n请兑外汇使用\n若兑值过低\n亦无可奈何\n吾或将归国\n惟船票筹措不易\n望贤妻与儿辈\n暂自珍重\n切勿过虑\n余不一一",
    modernExplanation:
      "书贤 1958 年从印尼万隆寄信回闽南：当地政局变动，华侨商业受限，他的布店已停业三个月。寄回印尼盾八十元，但兑换比价可能不好。他考虑归国，但船票难筹。让妻子和孩子们自己保重。",
    historicalNotes:
      "1957—59 年印尼颁布限制华侨经济的政策（如 PP10 总统令），许多华侨被迫结束商业、考虑回国。1960 年起出现大规模印尼归侨潮。'兑值过低 亦无可奈何' 反映了该时期印尼盾持续贬值与外汇管制双重夹击的现实。",
    ...SOURCE,
  },
];
