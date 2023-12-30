import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Section(props) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            className="min-w-[350px] min-h-[400px] max-h-[400px] max-w-[350px] mb-10 mr-10"
            ref={ref}
            style={{
                transform: isInView ? "none" : `${props.translate}`,
                opacity: isInView ? 1 : 0,
                transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${props.duration}`
            }}
        >
            {props.children}
        </div>
    );
}