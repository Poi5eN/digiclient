import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
   
  export function TabsDefault({Titletabs}) {
    // const data = [
    //   {
    //     label: "HTML",
    //     value: "html",
    //     color: "red",
    //     desc: `It really matters and then like it really doesn't matter.
    //     What matters is the people who are sparked by it. And the people 
    //     who are like offended by it, it doesn't matter.`,
    //   },
    //   {
    //     label: "React",
    //     value: "react",
    //     color: "green",
    //     desc: `Because it's about motivating the doers. Because I'm here
    //     to follow my dreams and inspire other people to follow their dreams, too.`,
    //   },
    //   {
    //     label: "Vue",
    //     value: "vue",
    //     color: "red",
    //     desc: `We're not always in the position that we want to be at.
    //     We're constantly growing. We're constantly making mistakes. We're
    //     constantly trying to express ourselves and actualize our dreams.`,
    //   },
    //   {
    //     label: "Angular",
    //     value: "angular",
    //     color: "red",
    //     desc: `Because it's about motivating the doers. Because I'm here
    //     to follow my dreams and inspire other people to follow their dreams, too.`,
    //   },
    //   {
    //     label: "Svelte",
    //     value: "svelte",
    //     color: "red",
    //     desc: `We're not always in the position that we want to be at.
    //     We're constantly growing. We're constantly making mistakes. We're
    //     constantly trying to express ourselves and actualize our dreams.`,
    //   },
    // ];
   
    return (
      <Tabs value="html"
      style={{background:"white"}}
      >
        <TabsHeader>
          {Titletabs.map(({ label, value,color }) => (
            <Tab key={value} value={value}
            style={{background:color ,borderRadius:"10px",marginLeft:"10px"}}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {Titletabs.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    );
  }