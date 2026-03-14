import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/courses";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import {
  ArrowRight,
  Play,
  BookOpen,
  Code2,
  Rocket,
  Crown,
  CheckCircle2,
  Star,
  Users,
  Trophy,
  Sparkles,
  LayoutDashboard,
  Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network
} from "lucide-react";
import { sanityFetch } from "@/sanity-server/lib/live";
import {
  FEATURED_COURSES_QUERY,
  STATS_QUERY,
} from "@/sanity-server/lib/queries";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // Fetch featured courses, stats, and check auth status
  const [{ data: courses }, { data: stats }, user] = await Promise.all([
    sanityFetch({ query: FEATURED_COURSES_QUERY }),
    sanityFetch({ query: STATS_QUERY }),
    currentUser(),
  ]);

  const isSignedIn = !!user;

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

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-violet-500/20 mb-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}>
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-green-300">
                Code Like a Professional
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}>
              <span className="block text-white">Future-Ready Coding</span>
              <span className="block bg-linear-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                the Professonal way
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}>
              Join EduX&apos;s Academy and learn through structured, hands-on
              programs designed for real job outcomes.{" "}
              <span className="text-fuchsia-400">Pro features</span> and{" "}
              <span className="text-cyan-400">Elite power</span>.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-linear-to-r from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400 text-white border-0 shadow-xl shadow-cyan-400/30 px-8 h-12 text-base font-semibold">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/courses">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-slate-600 bg-blue-900/5 text-white px-8 h-12 text-base hover:bg-blue-800/10 hover:text-white">
                      <Database className="w-4 h-4 mr-2" />
                      My Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="bg-linear-to-r from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400 text-white border-0 shadow-xl shadow-cyan-400/30 px-8 h-12 text-base font-semibold">
                      <Zap className="w-4 h-4 mr-2 fill-white" />
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-slate-600 bg-blue-900/5 text-white px-8 h-12 text-base hover:bg-blue-800/10 hover:text-white">
                      <Database className="w-4 h-4 mr-2" />
                      See All Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div
              className="mt-16 grid grid-cols-3 gap-8 md:gap-16 animate-fade-in"
              style={{ animationDelay: "0.5s" }}>
              {[
                {
                  value: stats?.courseCount ?? 0,
                  label: "Courses",
                  icon: Database,
                },
                {
                  value: stats?.lessonCount ?? 0,
                  label: "Lessons",
                  icon: Zap,
                },
                { value: "10K+", label: "Students", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-violet-400" />
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers Preview */}
        <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Foundation Plan",
                icon: Radar,
                color: "emerald",
                gradient: "from-emerald-500 to-teal-600",
                bgGlow: "bg-emerald-500/10",
                borderColor: "border-emerald-500/20",
                description: "Start your journey with foundational courses",
                features: [
                  "Core fundamentals",
                  "Community access",
                  "Basic projects",
                ],
              },
              {
                tier: "Professional",
                icon: Hexagon,
                color: "violet",
                gradient: "from-green-400 to-emerald-500",
                bgGlow: "bg-green-500/10",
                borderColor: "border-green-500/30",
                description: "Level up with advanced, production-ready content",
                features: [
                  "All Free content",
                  "Advanced courses",
                  "Priority support",
                  "Certificates",
                ],
                popular: true,
              },
              {
                tier: "Elite",
                icon: Activity,
                color: "cyan",
                gradient: "from-lime-400 to-green-600",
                bgGlow: "bg-lime-500/10",
                borderColor: "border-cyan-500/20",
                description:
                  "Unlock the real gems - AI tutor & exclusive content",
                features: [
                  "Everything in Pro",
                  "AI Learning Assistant",
                  "Exclusive content",
                  "1-on-1 sessions",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`relative p-8 rounded-2xl ${plan.bgGlow} border ${plan.borderColor} ${plan.popular ? "ring-2 ring-violet-500/50" : ""} transition-all duration-300 hover:scale-[1.02]`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
                <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2
                        className={`w-4 h-4 ${plan.color === "emerald" ? "text-emerald-400" : plan.color === "violet" ? "text-violet-400" : "text-cyan-400"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-slate-600 bg-blue-900/5 text-white hover:bg-blue-800/10 hover:text-white">
                Pricing In Detail
                <ArrowRightCircle className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Learn Skills That Deliver{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Real Impact
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Each course is packed with modules and lessons designed to take
              you from zero to job-ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course: (typeof courses)[number]) => (
              <CourseCard
                key={course.slug!.current!}
                slug={{ current: course.slug!.current! }}
                title={course.title}
                description={course.description}
                tier={course.tier}
                thumbnail={course.thumbnail}
                moduleCount={course.moduleCount}
                lessonCount={course.lessonCount}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-slate-600 bg-blue-900/5 text-white hover:bg-blue-800/10 hover:text-white">
                See Full Catalog
                <ArrowRightCircle className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="px-6 lg:px-12 py-20 max-w-7xl mx-auto flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-center mb-16 relative z-10 w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Developers{" "}
              <span className="bg-linear-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                love it
              </span>
            </h2>
          </div>

          <InfiniteMovingCards
            items={[
              {
                name: "Alex Chen",
                role: "Junior Developer",
                content:
                  "EduX's teaching style is incredible. I went from knowing nothing to landing my first dev job in 6 months!",
                avatar: "🧑‍💻",
              },
              {
                name: "Sarah Miller",
                role: "Freelancer",
                content:
                  "The Elite tier is worth every penny. The exclusive content and 1-on-1 sessions transformed my career.",
                avatar: "👩‍💼",
              },
              {
                name: "James Wilson",
                role: "CS Student",
                content:
                  "Best investment I've made. The Pro courses filled gaps my university courses never covered.",
                avatar: "🎓",
              },
              {
                name: "Emily Davies",
                role: "Senior Engineer",
                content:
                  "Superb quality. I bought the Pro course to brush up on my modern framework knowledge. Totally worth the price.",
                avatar: "💻",
              },
            ]}
            direction="left"
            speed="slow"
          />
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-linear-to-br from-emerald-900/40 via-teal-900/20 to-lime-900/40 border border-white/10 p-12 md:p-20 text-center overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-lime-500/20 blur-xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <Radar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Start Your Developer Journey Today
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
                Start with free courses or unlock everything with Professional
                and Elite. Your coding journey begins now.
              </p>
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400 text-white border-0 shadow-xl shadow-cyan-400/30 px-10 h-14 text-lg font-semibold">
                  View Pricing
                  <ArrowRightCircle className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t border-zinc-800/50 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">EduX&apos;s Academy</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-zinc-600">
              © 2024 EduX&apos;s Academy. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
