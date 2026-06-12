import React from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { useChartData } from "@/Utils/Hooks/useChart";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

// ── Design tokens ────────────────────────────────────────────────────────
const PALETTE = {
  primary: "#1A2B4A",   // deep navy — headings, primary text
  accent: "#5B7FFF",    // blue — primary series
  success: "#16A37E",   // green — secondary series / positive
  amber: "#E8742C",     // amber — tertiary series / highlight
  muted: "#94A3B8",     // muted gray-blue — gridlines, tertiary text
  pieColors: ["#5B7FFF", "#E8742C", "#16A37E", "#94A3B8"],
};

const CARD = "bg-white rounded-xl border border-slate-100 shadow-sm";

// ── Small building blocks ───────────────────────────────────────────────

const ChartCard = ({ title, subtitle, children, span }) => (
  <div className={`${CARD} p-5 ${span ? "md:col-span-2" : ""}`}>
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {subtitle && (
        <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </div>
    {children}
  </div>
);

const StatCard = ({ label, value, suffix, accentColor }) => (
  <div className={`${CARD} p-5 flex flex-col gap-1`}>
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-2xl font-semibold text-slate-800">
      {value}
      {suffix && (
        <span className="text-sm font-normal text-slate-400 ml-1">
          {suffix}
        </span>
      )}
    </span>
    <span
      className="h-1 w-8 rounded-full mt-1"
      style={{ backgroundColor: accentColor }}
    />
  </div>
);

const EmptyChart = ({ label }) => (
  <div className="h-[260px] flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
    Belum ada data {label}
  </div>
);

// Custom tooltip — flat, bordered, matches card chrome
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      {label && <p className="font-medium text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-500">
          <span style={{ color: entry.color }}>●</span>{" "}
          {entry.name}: <span className="font-medium text-slate-700">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const axisStyle = { fontSize: 12, fill: "#94A3B8" };

// ── Main dashboard ───────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuthStateContext();
  const { data = {}, isLoading } = useChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className={`${CARD} p-6 h-28 animate-pulse`} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${CARD} p-5 h-24 animate-pulse`} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${CARD} p-5 h-80 animate-pulse`} />
          ))}
        </div>
      </div>
    );
  }

  // ── Derived KPI numbers ──────────────────────────────────────────────
  const totalMahasiswa = students.reduce((acc, s) => acc + (s.count || 0), 0);
  const totalDosen = lecturerRanks.reduce((acc, l) => acc + (l.count || 0), 0);
  const totalFakultas = students.length;
  const pendaftaranTerakhir = registrations.length
    ? registrations[registrations.length - 1]
    : null;

  const namaUser = user?.name || "User";
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${CARD} p-6`}>
        <p className="text-sm text-slate-400">
          {isAdmin ? "Panel admin" : "Portal mahasiswa"}
        </p>
        <h1 className="text-2xl font-semibold text-slate-800 mt-1">
          Selamat datang, {namaUser}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {isAdmin
            ? "Ringkasan data akademik secara keseluruhan."
            : "Ringkasan informasi akademik kamu."}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total mahasiswa"
          value={totalMahasiswa.toLocaleString("id-ID")}
          accentColor={PALETTE.accent}
        />
        <StatCard
          label="Total dosen"
          value={totalDosen.toLocaleString("id-ID")}
          accentColor={PALETTE.success}
        />
        <StatCard
          label="Jumlah fakultas"
          value={totalFakultas}
          accentColor={PALETTE.amber}
        />
        <StatCard
          label="Pendaftaran terakhir"
          value={
            pendaftaranTerakhir
              ? pendaftaranTerakhir.total?.toLocaleString("id-ID")
              : "-"
          }
          suffix={pendaftaranTerakhir ? `(${pendaftaranTerakhir.year})` : ""}
          accentColor={PALETTE.muted}
        />
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* A. Mahasiswa per fakultas */}
        <ChartCard
          title="Mahasiswa per fakultas"
          subtitle="Distribusi jumlah mahasiswa aktif"
        >
          {students.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={students} barSize={28}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="faculty" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F8FAFC" }} />
                <Bar dataKey="count" name="Mahasiswa" fill={PALETTE.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="fakultas" />
          )}
        </ChartCard>

        {/* B. Rasio gender */}
        <ChartCard
          title="Rasio gender mahasiswa"
          subtitle="Perbandingan mahasiswa berdasarkan gender"
        >
          {genderRatio.length ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={genderRatio}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={2}
                  >
                    {genderRatio.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE.pieColors[index % PALETTE.pieColors.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {genderRatio.map((entry, index) => (
                  <span key={index} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ backgroundColor: PALETTE.pieColors[index % PALETTE.pieColors.length] }}
                    />
                    {entry.gender} ({entry.count})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart label="gender" />
          )}
        </ChartCard>

        {/* C. Tren pendaftaran */}
        <ChartCard
          title="Tren pendaftaran mahasiswa"
          subtitle="Jumlah pendaftar per tahun akademik"
        >
          {registrations.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={registrations}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Pendaftar"
                  stroke={PALETTE.success}
                  strokeWidth={2}
                  dot={{ r: 3, fill: PALETTE.success, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="pendaftaran" />
          )}
        </ChartCard>

        {/* D. Nilai mahasiswa per jurusan */}
        <ChartCard
          title="Nilai mahasiswa per jurusan"
          subtitle="Distribusi nilai A / B / C"
        >
          {gradeDistribution.length ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={gradeDistribution}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis dataKey="subject" tick={axisStyle} />
                  <PolarRadiusAxis tick={axisStyle} axisLine={false} />
                  <Radar name="Nilai A" dataKey="A" stroke={PALETTE.accent} fill={PALETTE.accent} fillOpacity={0.25} />
                  <Radar name="Nilai B" dataKey="B" stroke={PALETTE.success} fill={PALETTE.success} fillOpacity={0.2} />
                  <Radar name="Nilai C" dataKey="C" stroke={PALETTE.amber} fill={PALETTE.amber} fillOpacity={0.15} />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-1">
                {[
                  { label: "Nilai A", color: PALETTE.accent },
                  { label: "Nilai B", color: PALETTE.success },
                  { label: "Nilai C", color: PALETTE.amber },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart label="nilai" />
          )}
        </ChartCard>

        {/* E. Pangkat dosen */}
        <ChartCard
          title="Pangkat dosen"
          subtitle="Distribusi dosen berdasarkan jenjang jabatan akademik"
          span
        >
          {lecturerRanks.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={lecturerRanks}>
                <defs>
                  <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PALETTE.accent} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={PALETTE.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="rank" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Dosen"
                  stroke={PALETTE.accent}
                  strokeWidth={2}
                  fill="url(#colorLecturer)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="pangkat dosen" />
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;