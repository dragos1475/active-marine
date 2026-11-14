import { Sun, Eclipse, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { isSiteTheme, useSiteTheme } from "./Theme";

const OPTIONS = [{ value: "light", label: "Light", Icon: Sun }, { value: "medium", label: "Medium", Icon: Eclipse }, { value: "dark", label: "Dark", Icon: Moon }] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useSiteTheme();
  const ActiveIcon = OPTIONS.find((option) => option.value === theme)?.Icon ?? Sun;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Choose theme" title={`Theme: ${theme}`} className="shrink-0"><ActiveIcon /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => { if (isSiteTheme(value)) setTheme(value); }}>
          {OPTIONS.map(({ value, label, Icon }) => <DropdownMenuRadioItem key={value} value={value} className="gap-3 py-3"><Icon className="h-4 w-4" />{label}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}