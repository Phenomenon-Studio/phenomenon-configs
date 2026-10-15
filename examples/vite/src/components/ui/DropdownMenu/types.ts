import type { Menu as MenuPrimitive } from '@base-ui/react/menu';

export type DropdownMenuProps = MenuPrimitive.Root.Props;
export type DropdownMenuPortalProps = MenuPrimitive.Portal.Props;
export type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props;
export type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
    Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>;
export type DropdownMenuGroupProps = MenuPrimitive.Group.Props;
export type DropdownMenuItemProps = MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
};
export type DropdownMenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props & {
    inset?: boolean;
};
export type DropdownMenuRadioGroupProps = MenuPrimitive.RadioGroup.Props;
export type DropdownMenuRadioItemProps = MenuPrimitive.RadioItem.Props & {
    inset?: boolean;
};
export type DropdownMenuLabelProps = MenuPrimitive.GroupLabel.Props & {
    inset?: boolean;
};
export type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;
export type DropdownMenuShortcutProps = React.ComponentProps<'span'>;
export type DropdownMenuSubProps = MenuPrimitive.SubmenuRoot.Props;
export type DropdownMenuSubTriggerProps = MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
};
export type DropdownMenuSubContentProps = DropdownMenuContentProps;
