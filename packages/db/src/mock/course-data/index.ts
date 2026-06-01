import type { Courses, CoursesOptional } from "../../types";
import { agricultureCourses } from "./agriculture-courses";
import { economicsCourses } from "./economics-courses";
import { educationCourses } from "./education-courses";
import { engineeringCourses } from "./engineering-courses";
import { lawCourses } from "./law-courses";
import { literatureCourses } from "./literature-courses";
import { medicineCourses } from "./medicine-courses";
import { scienceCourses } from "./science-courses";
import { sociologyCourses } from "./sociology-courses";

// Common courses for social sciences
export const socialScienceCourses: Omit<Courses, CoursesOptional>[] = [
	{
		name: "基礎ゼミ",
		targetGrade: 2,
		weekdays: 1,
		period: 1,
		credits: 2,
		requirements: "必修",
		classRoom: "L101",
	},
	{
		name: "演習ⅰ",
		targetGrade: 3,
		weekdays: 2,
		period: 2,
		credits: 1,
		requirements: "必修",
		classRoom: "L201",
	},
	{
		name: "演習ⅱ",
		targetGrade: 4,
		weekdays: 3,
		period: 3,
		credits: 1,
		requirements: "必修",
		classRoom: "L301",
	},
	{
		name: "卒業論文",
		targetGrade: 4,
		weekdays: 4,
		period: 4,
		credits: 4,
		requirements: "必修",
		classRoom: "L401",
	},
];

// Common courses for natural sciences
export const naturalScienceCourses: Omit<Courses, CoursesOptional>[] = [
	{
		name: "基礎演習",
		targetGrade: 2,
		weekdays: 2,
		period: 2,
		credits: 1,
		requirements: "必修",
		classRoom: "L102",
	},
	{
		name: "学生実験・演習ⅰ",
		targetGrade: 3,
		weekdays: 3,
		period: 3,
		credits: 2,
		requirements: "必修",
		classRoom: "L202",
	},
	{
		name: "学生実験・演習ⅱ",
		targetGrade: 4,
		weekdays: 4,
		period: 4,
		credits: 2,
		requirements: "必修",
		classRoom: "L302",
	},
	{
		name: "卒業研究",
		targetGrade: 4,
		weekdays: 5,
		period: 5,
		credits: 4,
		requirements: "必修",
		classRoom: "L402",
	},
];

// General education courses
export const generalEducationCourses: Omit<Courses, CoursesOptional>[] = [
	{
		name: "体育実技（バレーボール）",
		targetGrade: 1,
		weekdays: 1,
		period: 5,
		credits: 1,
		requirements: "必修",
		classRoom: "Gym A",
	},
	{
		name: "体育実技（バスケットボール）",
		targetGrade: 1,
		weekdays: 2,
		period: 5,
		credits: 1,
		requirements: "必修",
		classRoom: "Gym B",
	},
	{
		name: "体育実技（テニス）",
		targetGrade: 1,
		weekdays: 3,
		period: 5,
		credits: 1,
		requirements: "必修",
		classRoom: "Court 1",
	},
	{
		name: "体育実技（ハンドボール）",
		targetGrade: 1,
		weekdays: 4,
		period: 5,
		credits: 1,
		requirements: "必修",
		classRoom: "Gym A",
	},
	{
		name: "体育実技（ラグビー）",
		targetGrade: 1,
		weekdays: 5,
		period: 2,
		credits: 1,
		requirements: "必修",
		classRoom: "Field 1",
	},
	{
		name: "学術ゼミ",
		targetGrade: 2,
		weekdays: 1,
		period: 3,
		credits: 2,
		requirements: "任意",
		classRoom: "L120",
	},
	{
		name: "教養ゼミ",
		targetGrade: 1,
		weekdays: 2,
		period: 1,
		credits: 2,
		requirements: "必修",
		classRoom: "L220",
	},
	{
		name: "数学基礎",
		targetGrade: 1,
		weekdays: 3,
		period: 1,
		credits: 2,
		requirements: "任意",
		classRoom: "L320",
	},
	{
		name: "英語ⅰ",
		targetGrade: 1,
		weekdays: 4,
		period: 1,
		credits: 2,
		requirements: "必修",
		classRoom: "L121",
	},
	{
		name: "英語ⅱ",
		targetGrade: 1,
		weekdays: 5,
		period: 1,
		credits: 2,
		requirements: "任意",
		classRoom: "L221",
	},
	{
		name: "ドイツ語",
		targetGrade: 1,
		weekdays: 1,
		period: 2,
		credits: 2,
		requirements: "必修",
		classRoom: "L321",
	},
	{
		name: "フランス語",
		targetGrade: 1,
		weekdays: 2,
		period: 2,
		credits: 2,
		requirements: "必修",
		classRoom: "L122",
	},
	{
		name: "中国語",
		targetGrade: 2,
		weekdays: 3,
		period: 4,
		credits: 1,
		requirements: "必修",
		classRoom: "L222",
	},
	{
		name: "ロシア語",
		targetGrade: 2,
		weekdays: 4,
		period: 4,
		credits: 1,
		requirements: "必修",
		classRoom: "L322",
	},
	{
		name: "キャリアデザイン概論ⅰ",
		targetGrade: 3,
		weekdays: 1,
		period: 4,
		credits: 1,
		requirements: "任意",
		classRoom: "L123",
	},
	{
		name: "キャリアデザイン概論ⅱ",
		targetGrade: 3,
		weekdays: 2,
		period: 4,
		credits: 1,
		requirements: "任意",
		classRoom: "L223",
	},
];

// Export all courses combined
export const allCourses: Omit<Courses, CoursesOptional>[] = [
	...literatureCourses,
	...economicsCourses,
	...lawCourses,
	...educationCourses,
	...sociologyCourses,
	...scienceCourses,
	...engineeringCourses,
	...agricultureCourses,
	...medicineCourses,
	...generalEducationCourses,
	...socialScienceCourses,
	...naturalScienceCourses,
];

// Export the main courseList for backward compatibility
export const courseList: Omit<Courses, CoursesOptional>[] = allCourses;
