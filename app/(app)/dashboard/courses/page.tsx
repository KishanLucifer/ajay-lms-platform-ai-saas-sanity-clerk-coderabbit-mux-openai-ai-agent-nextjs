import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen , Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network} from "lucide-react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/courses";
import { sanityFetch } from "@/sanity-server/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity-server/lib/queries";
import { getUserTier } from "@/lib/course-access";
import Link from "next/link";

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const [{ data: courses }, userTier] = await Promise.all([
    sanityFetch({
      query: DASHBOARD_COURSES_QUERY,
      params: { userId: user.id },
    }),
    getUserTier()
  ]);

  // Calculate completion for each course and filter to started ones
  type Course = (typeof courses)[number];
  type CourseWithProgress = Course & {
    totalLessons: number;
    completedLessons: number;
  };

  // const startedCourses = courses.reduce<CourseWithProgress[]>((acc, course) => {
  //   const { total, completed } = (course.modules ?? []).reduce(
  //     (stats, m) =>
  //       (m.lessons ?? []).reduce(
  //         (s, l) => ({
  //           total: s.total + 1,
  //           completed: s.completed + (l.completedBy?.includes(user.id) ? 1 : 0),
  //         }),
  //         stats,
  //       ),
  //     { total: 0, completed: 0 },
  //   );

  //   if (completed > 0) {
  //     acc.push({ ...course, totalLessons: total, completedLessons: completed });
  //   }
  //   return acc;
  // }, []);
  const startedCourses = courses.reduce(
    (acc: CourseWithProgress[], course: Course) => {
      const { total, completed } = (course.modules ?? []).reduce(
        (stats: { total: number; completed: number }, m: any) =>
          (m.lessons ?? []).reduce(
            (s: { total: number; completed: number }, l: any) => ({
              total: s.total + 1,
              completed:
                s.completed + (l.completedBy?.includes(user.id) ? 1 : 0),
            }),
            stats
          ),
        { total: 0, completed: 0 }
      );

      if (completed > 0) {
        acc.push({
          ...course,
          totalLessons: total,
          completedLessons: completed,
        });
      }

      return acc;
    },
    [] as CourseWithProgress[]
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-150 h-150 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-teal-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-100 h-100 bg-lime-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-zinc-400">
            Courses you&apos;ve started learning. Pick up where you left off.
          </p>
        </div>

        {userTier !== "ultra" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link
              href="/pricing"
              className="p-6 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                    Upgrade to {userTier === "free" ? "Pro" : "Ultra"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {userTier === "pro"
                      ? "Get AI Learning Assistant & exclusive content"
                      : "Unlock more courses & features"}
                  </p>
                </div>
                <ArrowRightCircle className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}

        {startedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startedCourses.map((course: CourseWithProgress) => (
              <CourseCard
                key={course.slug!.current!}
                slug={{ current: course.slug!.current! }}
                title={course.title}
                description={course.description}
                tier={course.tier}
                thumbnail={course.thumbnail}
                moduleCount={course.moduleCount}
                lessonCount={course.totalLessons}
                completedLessonCount={course.completedLessons}
                isCompleted={course.completedBy?.includes(user.id) ?? false}
                showProgress
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No courses started yet
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Browse our course catalog and start learning. Your progress will
              appear here once you complete your first lesson.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
