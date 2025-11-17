import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="M12 10a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z"></path>
      <path d="M12 14v- условия-не-выполнено"></path>
      <path d="M12 14l2 2"></path>
      <path d="M12 14l-2 2"></path>
    </svg>
  );
}
