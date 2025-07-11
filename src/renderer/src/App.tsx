// import { useDockableLocalStorage } from "@renderer/components/dockable";
import "./App.css";

export const App: React.FC = () => {
  // const { layout, setLayout } = useDockableLocalStorage(2);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      Hello
      {/* <Dockable.Root layout={layout} onChange={setLayout}>
        <Dockable.Tab id={"1"} name={"View 1"}>
          {"testing content"}
        </Dockable.Tab>
        <Dockable.Tab id={"2"} name={"View 2"}>
          {"testing content"}
        </Dockable.Tab>
      </Dockable.Root> */}
    </div>
  );
};
