import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const variants = {
    hidden: { opacity: 0, x: -20, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -20 },
};

const Layout = ({ children }) => {
    const router = useRouter();

    return (
        <div className="font-sans antialiased text-text-primary">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                <motion.main
                    key={router.asPath}
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
                    className="min-h-screen"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
};

export default Layout;
