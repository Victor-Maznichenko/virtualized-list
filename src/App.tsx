import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./App.css";

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
   const [scrollTop, setScrollTop] = useState(0);
   const [listItems, setListItems] = useState(itemsData);
   const scrollContainerElRef = useRef<HTMLDivElement>(null);
   const totalListHeight = ListProperties.itemHeight * listItems.length;

   /* 
    UseLayoutEffect используем чтобы не было морганий экрана (момент 6:10 непонятен из видео)
   */
   useLayoutEffect(() => {
      const scrollContainerEl = scrollContainerElRef.current;

      if (!scrollContainerEl) return;

      const handleScroll = () => setScrollTop(scrollContainerEl.scrollTop);

      handleScroll();
      scrollContainerEl.addEventListener("scroll", handleScroll);
      return () => scrollContainerEl.removeEventListener("scroll", handleScroll);
   }, []);

   /* 
    На основе полученного scrollTop вычислим range index-ов которые мы должны рендерить
   */
   const calcItemsProperties = useMemo(() => {
      /* Первоначальная логика */
      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + ListProperties.containerHeight;

      let startIndex = Math.floor(rangeStart / ListProperties.itemHeight);
      let endIndex = Math.ceil(rangeEnd / ListProperties.itemHeight);

      /* Логика с overscan */
      const lastIndex = listItems.length - 1;
      startIndex = Math.max(0, startIndex - ListProperties.overscan);
      endIndex = Math.min(lastIndex, endIndex + ListProperties.overscan);
      console.log(startIndex, endIndex);

      let ItemsProperties = [];

      for (let index = startIndex; index <= endIndex; index++) {
         ItemsProperties.push({
            index,
            offsetTop: index * ListProperties.itemHeight,
         });
      }

      return ItemsProperties;
   }, [scrollTop, listItems.length]);

   //  const itemsToRender = listItems.slice(startIndex, endIndex + 1); // Так работает slice что надо писать + 1

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
               {calcItemsProperties.map(({ index, offsetTop }) => {
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
