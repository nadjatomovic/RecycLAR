export type TeacherBadgeProgress = {
  key: string;
  name: string;
  description: string;
  imageKey: string;
  current: number;
  goal: number;
  unlocked: boolean;
};

export function getTeacherBadges(stats: {
  totalClassPoints: number;
  weeklyBestClassPoints: number;
  totalQuizCompleted: number;
  top3ClassesCount: number;
  activeClassesCount: number;
  diversityScore: number;
}): TeacherBadgeProgress[] {
  const badges: TeacherBadgeProgress[] = [
    {
      key: "bedzSuperMentor",
      name: "Super mentor",
      description: "Profesorjevi razredi so skupaj zbrali 5000 točk.",
      imageKey: "bedzSuperMentor",
      current: stats.totalClassPoints,
      goal: 5000,
      unlocked: stats.totalClassPoints >= 5000,
    },
    {
      key: "bedzEkoVodja",
      name: "Eko vodja",
      description: "Vsaj en razred je ta teden zbral 1000 točk.",
      imageKey: "bedzEkoVodja",
      current: stats.weeklyBestClassPoints,
      goal: 1000,
      unlocked: stats.weeklyBestClassPoints >= 1000,
    },
    {
      key: "bedzKvizMojster",
      name: "Kviz mojster",
      description: "Učenci so skupaj zaključili 50 kvizov.",
      imageKey: "bedzKvizMojster",
      current: stats.totalQuizCompleted,
      goal: 50,
      unlocked: stats.totalQuizCompleted >= 50,
    },
    {
      key: "bedzRazredniNavdih",
      name: "Razredni navdih",
      description: "Eden izmed profesorjevih razredov je dosegel top 3 na lestvici.",
      imageKey: "bedzRazredniNavdih",
      current: stats.top3ClassesCount,
      goal: 1,
      unlocked: stats.top3ClassesCount >= 1,
    },
    {
      key: "bedzZeleniOrganizator",
      name: "Zeleni organizator",
      description: "Profesor vodi vsaj 5 aktivnih razredov.",
      imageKey: "bedzZeleniOrganizator",
      current: stats.activeClassesCount,
      goal: 5,
      unlocked: stats.activeClassesCount >= 5,
    },
    {
      key: "bedzEkoRaziskovalec",
      name: "Eko raziskovalec",
      description: "Razredi so pokazali raznoliko eko aktivnost.",
      imageKey: "bedzEkoRaziskovalec",
      current: stats.diversityScore,
      goal: 100,
      unlocked: stats.diversityScore >= 100,
    },
  ];

  return badges;
}