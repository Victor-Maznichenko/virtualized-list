import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { useVirtualizedList } from "./hooks";

const itemsData = Array.from({ length: 20_000 }, (_, i) => ({
   id: Math.random().toString(36).slice(2),
   text: String(i),
}));

const ListProperties = {
   overscan: 3,
   itemHeight: 40,
   containerHeight: 600,
};

function App() {
   const [listItems, setListItems] = useState(itemsData);
   const { totalListHeight, ItemsProperties, scrollContainerElRef } = useVirtualizedList({
      itemsLength: listItems.length,
      itemHeight: ListProperties.itemHeight,
      containerHeight: ListProperties.containerHeight,
   });

   const handleReverseList = () => setListItems((items) => items.slice().reverse());

   return (
      <main className="app">
         <h1>List</h1>
         <button
            style={{
               display: "block",
               marginBottom: 12,
            }}
            onClick={handleReverseList}
            type="button"
         >
            reverse
         </button>
         <div
            ref={scrollContainerElRef}
            style={{
               height: ListProperties.containerHeight,
               border: "1px solid tomato",
               position: "relative",
               overflow: "auto",
            }}
         >
            <div style={{ height: totalListHeight }}>
               {ItemsProperties.map(({ index, offsetTop }) => {
                  const { id, text } = listItems[index];

                  return (
                     <div
                        style={{
                           height: ListProperties.itemHeight,
                           transform: `translateY(${offsetTop}px)`,
                           position: "absolute",
                           padding: "6px 12px",
                           top: 0,
                        }}
                        key={id}
                     >
                        {text}
                     </div>
                  );
               })}
            </div>
         </div>
      </main>
   );
}

export default App;
