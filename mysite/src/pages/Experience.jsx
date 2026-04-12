import React from "react";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
import { Header } from "../components/Headers";

const education = [
  {
    year: "2024 — Continuing",
    title: "Faculty of electrical engineering CTU in Prague",
    subtitle: "BCc in Computer Science",
    description:
      "Degree program: Open informatics. Specialization: Computer games. Focused on software engineering, algorithms, and web technologies.",
  },
  {
    year: "2020 — 2024",
    title: "Secondary Technical School of Mechanical Engineering",
    subtitle: "Information Technology",
    description:
      "Introduction to programming (mainly C#), networking, hardware systems, 3D modeling and basic computer integrated manufacturing.",
  },
  {
    year: "2011 — 2020",
    title: "Primary School",
    subtitle: "Red Hill Primary School",
    description: "Quality primary school in Prague.",
  },
];

const jobs = [
  {
    year: "2024 — Present",
    title: "Security & Reception Services",
    subtitle: "Part-time",
    description:
      "Responsible for site monitoring and administrative tasks. This role provides a professional environment that allows me to balance work with my ongoing university studies.",
  },
  {
    year: "2023 — 2024",
    title: "Frontend Developer",
    subtitle: "Numoteq",
    description:
      "Modernized legacy web applications by migrating to React and Tailwind CSS. Successfully optimized performance, leading to a 40% improvement in page load speeds.",
  },
  {
    year: "May 2022 (2 weeks)",
    title: "IT Support Intern",
    subtitle: "Eaton",
    description:
      "Completed a mandatory school internship focused on corporate IT infrastructure. Provided technical assistance to staff and assisted with hardware maintenance.",
  },
  {
    year: "July 2021 — April 2023",
    title: "Team member / Cashier / Guest Experience Leader",
    subtitle: "McDonald's",
    description:
      "Started as a team member and cashier was promoted to Guest Experience Leader due to strong performance. Working in a high-traffic city center location, I communicated daily with international customers in English.",
  },
];

function Experience() {
  return (
    <div>
      <Hero
        badge="experience"
        title={
          <>
            My journey <br /> so far
          </>
        }
        description="In here you can find lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus nibh,"
      />
      <div>
        <Header className="text-center" level={2}>
          Work Experience
        </Header>
        <Timeline items={jobs} />

        <Header className="text-center" level={2}>
          Education
        </Header>
        <Timeline items={education} />
      </div>
    </div>
  );
}

export default Experience;
