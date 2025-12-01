export const COLOR = {
    // Background layers - avoid pure black, use softer grays
    '--background-color-one': '#0f172a',      // Deepest layer (slate-950)
    '--background-color-two': '#1e293b',      // Mid layer (slate-900)
    '--background-color-three': '#334155',    // Surface layer (slate-800)

    // Borders - slightly lighter for better definition
    '--border-color-one': '#475569',          // Slate-600

    // Text colors - improved contrast ratios
    '--text-color-one': '#94a3b8',            // Muted text (slate-400)
    '--text-color-two': '#f1f5f9',            // Primary text (slate-100) - softer than pure white

    // Interactive states
    '--hover-background-color-one': '#475569', // Slate-600

    // Status colors - distinct and accessible
    '--pending-color-one': '#fbbf24',         // Amber-400 (warm, attention-grabbing)
    '--complete-color-one': '#34d399',        // Emerald-400 (success indicator)
    
    // Additional recommended colors
    '--accent-color-primary': '#3b82f6',      // Blue-500 (primary actions)
    '--accent-color-secondary': '#8b5cf6',    // Violet-500 (secondary actions)
    '--error-color': '#f87171',               // Red-400 (errors/warnings)
    '--text-color-muted': '#64748b',          // Slate-500 (even more subtle text)
}
