import type { User, UserOptional } from "../types";

const defaultUserValues = {
	emailVerified: true,
	role: "professor",
	twoFactorEnabled: true,
};

export const mockProfessors: Omit<User, UserOptional>[] = [
	{
		name: "田村四郎",
		email: "prof1@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "林翔太",
		email: "prof2@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "太田信",
		email: "prof3@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "西山豊",
		email: "prof4@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "鈴木仁",
		email: "prof5@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "田村勇",
		email: "prof6@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "渡部九郎",
		email: "prof7@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "伊藤正",
		email: "prof8@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "佐藤勇",
		email: "prof9@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中島四郎",
		email: "prof10@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡本隆",
		email: "prof11@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "田中誠",
		email: "prof12@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小島十郎",
		email: "prof13@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小川修",
		email: "prof14@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小島明",
		email: "prof15@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "斎藤七郎",
		email: "prof16@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長谷川蒼",
		email: "prof17@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山田稔",
		email: "prof18@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長谷川修",
		email: "prof19@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "佐藤正",
		email: "prof20@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小島三郎",
		email: "prof21@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤井忠",
		email: "prof22@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤本孝",
		email: "prof23@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山田義",
		email: "prof24@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山下学",
		email: "prof25@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "松田大輔",
		email: "prof26@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤原慧",
		email: "prof27@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "青木涼平",
		email: "prof28@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "伊藤十郎",
		email: "prof29@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "井上健太",
		email: "prof30@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "渡部優",
		email: "prof31@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "森慧",
		email: "prof32@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "林正",
		email: "prof33@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小川五郎",
		email: "prof34@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "松本信",
		email: "prof35@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡崎稔",
		email: "prof36@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "加藤誠",
		email: "prof37@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "太田十郎",
		email: "prof38@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "加藤努",
		email: "prof39@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "加藤満",
		email: "prof40@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "近藤海斗",
		email: "prof41@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中島翔太",
		email: "prof42@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "太田拓也",
		email: "prof43@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "鈴木雄大",
		email: "prof44@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "橋本海斗",
		email: "prof45@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "後藤一郎",
		email: "prof46@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中村四郎",
		email: "prof47@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中野礼",
		email: "prof48@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "斉藤涼平",
		email: "prof49@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "橋本十郎",
		email: "prof50@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "木村和",
		email: "prof51@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "田村努",
		email: "prof52@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "田村博",
		email: "prof53@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "坂本優",
		email: "prof54@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "林清",
		email: "prof55@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤田大輔",
		email: "prof56@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "水野愛",
		email: "prof57@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山田浩",
		email: "prof58@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山田二郎",
		email: "prof59@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "前田勇",
		email: "prof60@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡本勇",
		email: "prof61@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡本進",
		email: "prof62@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "清水豊",
		email: "prof63@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小林二郎",
		email: "prof64@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "西山和",
		email: "prof65@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "石井九郎",
		email: "prof66@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中村勇",
		email: "prof67@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤原努",
		email: "prof68@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小川七郎",
		email: "prof69@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "吉田大輔",
		email: "prof70@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "太田洋",
		email: "prof71@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "伊藤涼平",
		email: "prof72@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中村稔",
		email: "prof73@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中山慧",
		email: "prof74@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "遠藤裕太",
		email: "prof75@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長谷川八郎",
		email: "prof76@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "吉田礼",
		email: "prof77@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "太田明",
		email: "prof78@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "中村優",
		email: "prof79@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "近藤礼",
		email: "prof80@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "杉山博",
		email: "prof81@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "松田四郎",
		email: "prof82@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡崎正",
		email: "prof83@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "上田九郎",
		email: "prof84@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "林大輔",
		email: "prof85@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡本四郎",
		email: "prof86@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "清水正",
		email: "prof87@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "木村修",
		email: "prof88@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "藤原十郎",
		email: "prof89@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "前田九郎",
		email: "prof90@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "前田慧",
		email: "prof91@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "橋本誠",
		email: "prof92@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "小林清",
		email: "prof93@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "原実",
		email: "prof94@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡崎拓也",
		email: "prof95@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "武田裕太",
		email: "prof96@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "石川誠",
		email: "prof97@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山口満",
		email: "prof98@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "橋本学",
		email: "prof99@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "西山治",
		email: "prof100@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "石川七郎",
		email: "prof101@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "青森夏彦",
		email: "prof102@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡山優",
		email: "prof103@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "富山和彦",
		email: "prof104@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "新潟礼",
		email: "prof105@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山形九郎",
		email: "prof106@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨正晴",
		email: "prof107@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "高知満",
		email: "prof108@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "静岡蒼",
		email: "prof109@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮城忠",
		email: "prof110@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "群馬一誠",
		email: "prof111@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "千葉信",
		email: "prof112@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福岡浩一",
		email: "prof113@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮崎稔",
		email: "prof114@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岐阜仁",
		email: "prof115@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮城忠",
		email: "prof116@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長崎慧",
		email: "prof117@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "東京拓也",
		email: "prof118@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "徳島愛",
		email: "prof119@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "群馬勇",
		email: "prof120@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨夏彦",
		email: "prof121@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岩手翔太",
		email: "prof122@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "埼玉涼平",
		email: "prof123@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "秋田涼平",
		email: "prof124@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "熊本十郎",
		email: "prof125@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "秋田実",
		email: "prof126@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮城陸",
		email: "prof127@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "千葉翔太",
		email: "prof128@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮崎五郎",
		email: "prof129@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "青森十郎",
		email: "prof130@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "大分仁",
		email: "prof131@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山口夕紀",
		email: "prof132@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "千葉治",
		email: "prof133@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨勇",
		email: "prof134@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "奈良正晴",
		email: "prof135@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "愛媛春樹",
		email: "prof136@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "沖縄清志",
		email: "prof137@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "静岡陸",
		email: "prof138@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "石川進",
		email: "prof139@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "青森智",
		email: "prof140@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "埼玉礼",
		email: "prof141@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "秋田正晴",
		email: "prof142@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "大分秋人",
		email: "prof143@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長崎雄大",
		email: "prof144@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岐阜浩一",
		email: "prof145@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福井慧",
		email: "prof146@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "沖縄努",
		email: "prof147@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮崎進",
		email: "prof148@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨満",
		email: "prof149@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "千葉裕太",
		email: "prof150@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "高知修",
		email: "prof151@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "石川信",
		email: "prof152@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "熊本仁",
		email: "prof153@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "茨城実",
		email: "prof154@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "埼玉信",
		email: "prof155@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "群馬礼",
		email: "prof156@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "熊本一誠",
		email: "prof157@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福岡健太郎",
		email: "prof158@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "香川雄大",
		email: "prof159@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "和歌山翔太",
		email: "prof160@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山口清志",
		email: "prof161@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岩手治",
		email: "prof162@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "茨城信",
		email: "prof163@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岐阜慧",
		email: "prof164@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "愛知勇",
		email: "prof165@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福岡豊",
		email: "prof166@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "栃木十郎",
		email: "prof167@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岐阜満",
		email: "prof168@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "群馬修",
		email: "prof169@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "大分治",
		email: "prof170@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "秋田六郎",
		email: "prof171@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "熊本蒼",
		email: "prof172@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "群馬夕紀",
		email: "prof173@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山口稔",
		email: "prof174@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山形忠",
		email: "prof175@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "宮崎秋人",
		email: "prof176@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岩手努",
		email: "prof177@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岩手清志",
		email: "prof178@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "新潟学",
		email: "prof179@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨和彦",
		email: "prof180@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "沖縄清志",
		email: "prof181@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "熊本稔",
		email: "prof182@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "静岡愛",
		email: "prof183@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岐阜進",
		email: "prof184@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福岡信",
		email: "prof185@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨十郎",
		email: "prof186@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "大分五郎",
		email: "prof187@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "高知海斗",
		email: "prof188@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "長崎清志",
		email: "prof189@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "秋田健太郎",
		email: "prof190@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岩手三樹",
		email: "prof191@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "山梨稔",
		email: "prof192@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福岡豊",
		email: "prof193@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "徳島春樹",
		email: "prof194@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "埼玉涼平",
		email: "prof195@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "岡山二郎",
		email: "prof196@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "福井秋人",
		email: "prof197@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "東京忠",
		email: "prof198@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "大分七郎",
		email: "prof199@university.ac.jp",
		...defaultUserValues,
	},
	{
		name: "富山修",
		email: "prof200@university.ac.jp",
		...defaultUserValues,
	},
];

// 教員数: 200
export const professorCount = 200;
