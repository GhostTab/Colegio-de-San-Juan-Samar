import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot, Send, Lock } from "lucide-react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-card overflow-hidden"
          >
            <div className="p-4 gradient-primary flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="w-5 h-5" />
                <span className="font-semibold text-sm">CSJS AI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-1">Future Feature</h4>
              <p className="text-sm text-muted-foreground mb-4">
                An AI-powered assistant to help students with lessons and answer questions is coming soon.
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary">
                <input
                  disabled
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent text-sm outline-none text-muted-foreground placeholder:text-muted-foreground/50"
                />
                <Send className="w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
