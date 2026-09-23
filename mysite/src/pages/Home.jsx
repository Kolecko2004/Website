import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import { Button } from "../components/Button";

const FEATURE_DATA = [
  {
    path: "/projects",
    id: "projects",
    title: "Projects",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus nibh, dapibus in euismod sit amet, efficitur quis sem. Phasellus aliquet diam a feugiat placerat.",
  },
  {
    path: "/experience",
    id: "experience",
    title: "Experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus nibh, dapibus in euismod sit amet, efficitur quis sem. Phasellus aliquet diam a feugiat placerat.",
  },
  {
    path: "/hobbies",
    id: "hobbies",
    title: "Hobbies",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus nibh, dapibus in euismod sit amet, efficitur quis sem. Phasellus aliquet diam a feugiat placerat.",
  },
];

export default function Home() {
  return (
    <div>
      <Hero
        title={
          <>
            Vojtěch <br /> Drozd
          </>
        }
        description="I build functional web applications using React and Tailwind. Focused on clean code and simple interfaces."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto my-12">
        {FEATURE_DATA.map((item, index) => (
          <div key={item.id} className={index === 0 ? "md:col-span-2" : ""}>
            <FeatureBlock title={item.title} description={item.description}>
              <Button className="mx-auto" href={item.path}>
                Explore {item.title}
              </Button>
            </FeatureBlock>
          </div>
        ))}
      </div>
    </div>
  );
}
