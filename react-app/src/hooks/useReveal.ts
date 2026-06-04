import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useReveal(threshold = 0.12): void {
  const { pathname } = useLocation();
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    elements.forEach((el) => el.classList.remove("visible"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, threshold]);
}
