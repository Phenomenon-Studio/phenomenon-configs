import { SunIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/DropdownMenu';

function ThemeItem() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenuGroup>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <SunIcon />
                    Toggle theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme as (value: string) => void}>
                            <DropdownMenuRadioItem closeOnClick={true} value="light">
                                Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem closeOnClick={true} value="dark">
                                Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem closeOnClick={true} value="system">
                                System
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        </DropdownMenuGroup>
    );
}

export { ThemeItem };
