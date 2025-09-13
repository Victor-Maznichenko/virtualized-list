import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface UseVirtualizedListProps {
   containerHeight: number;
   itemsLength: number;
   itemHeight: number;
   overscan?: number;
   scrollingDelay?: number;
}

export const useVirtualizedList = ({
   containerHeight,
   itemsLength,
   itemHeight,
   overscan = 3,
   scrollingDelay = 150,
}: UseVirtualizedListProps) => {
   const [isScrolling, setIsScrolling] = useState(false);
   const [scrollTop, setScrollTop] = useState(0);
   const scrollContainerElRef = useRef<HTMLDivElement>(null);

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

   useEffect(() => {
      const scrollContainerEl = scrollContainerElRef.current;

      if (!scrollContainerEl) return;

      let timeoutId: Nullable<number> = null;

      const handleScroll = () => {
         setIsScrolling(true);

         if (typeof timeoutId === "number") {
            clearTimeout(timeoutId);
         }

         timeoutId = setTimeout(() => {
            setIsScrolling(false);
         }, scrollingDelay);
      };

      scrollContainerEl.addEventListener("scroll", handleScroll);

      return () => {
         if (typeof timeoutId === "number") clearTimeout(timeoutId);
         scrollContainerEl.removeEventListener("scroll", handleScroll);
      };
   }, []);

   /* 
        На основе полученного scrollTop вычислим range index-ов которые мы должны рендерить
       */
   const { ItemsProperties, startIndex, endIndex } = useMemo(() => {
      /* Первоначальная логика */
      const rangeStart = scrollTop;
      const rangeEnd = scrollTop + containerHeight;

      let startIndex = Math.floor(rangeStart / itemHeight);
      let endIndex = Math.ceil(rangeEnd / itemHeight);

      /* Логика с overscan */
      const lastIndex = itemsLength - 1;
      startIndex = Math.max(0, startIndex - overscan);
      endIndex = Math.min(lastIndex, endIndex + overscan);

      let ItemsProperties = [];

      for (let index = startIndex; index <= endIndex; index++) {
         ItemsProperties.push({
            index,
            offsetTop: index * itemHeight,
         });
      }

      return { ItemsProperties, startIndex, endIndex };
   }, [scrollTop, itemsLength]);

   return {
      totalListHeight: itemHeight * itemsLength,
      ItemsProperties,
      isScrolling,
      startIndex,
      endIndex,
      scrollContainerElRef,
   };
};
