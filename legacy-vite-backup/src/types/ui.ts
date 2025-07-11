import type { BaseComponentProps } from './index'

// Button component variants and sizes
export type ButtonVariant = "default" | "ghost" | "destructive" | "outline" | "secondary"
export type ButtonSize = "default" | "sm" | "lg" | "icon"

// Button component props
export interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  asChild?: boolean
}

// Input component props
export interface InputProps extends BaseComponentProps, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
}

// Textarea component props
export interface TextareaProps extends BaseComponentProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  rows?: number
}

// Select component props
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends BaseComponentProps {
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  multiple?: boolean
}

// Navigation item interface
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  badge?: string | number
  children?: NavigationItem[]
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  preventScroll?: boolean
}

// Dialog component props
export interface DialogProps extends ModalProps {
  footer?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: "default" | "destructive" | "warning"
}

// Form field wrapper props
export interface FormFieldProps extends BaseComponentProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  padding?: "none" | "sm" | "md" | "lg"
}

// Badge component props
export interface BadgeProps extends BaseComponentProps {
  variant?: "default" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
}

// Avatar component props
export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
}

// Loading spinner props
export interface SpinnerProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "white"
}

// Progress bar props
export interface ProgressProps extends BaseComponentProps {
  value: number
  max?: number
  variant?: "default" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

// Tooltip props
export interface TooltipProps extends BaseComponentProps {
  content: React.ReactNode
  placement?: "top" | "bottom" | "left" | "right"
  delay?: number
  children: React.ReactNode
}

// Dropdown menu props
export interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  separator?: boolean
}

export interface DropdownMenuProps extends BaseComponentProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  onSelect: (value: string) => void
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end"
}

// Table component props
export interface TableColumn<T = any> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string | number
  align?: "left" | "center" | "right"
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>
  rowKey?: string | ((record: T) => string)
  emptyText?: string
}

// Tabs component props
export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[]
  activeKey?: string
  onChange?: (key: string) => void
  variant?: "line" | "card" | "pill"
}

// Search component props
export interface SearchProps extends BaseComponentProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  loading?: boolean
  suggestions?: string[]
  showClearButton?: boolean
}

// File upload props
export interface FileUploadProps extends BaseComponentProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange: (files: File[]) => void
  onError?: (error: string) => void
  preview?: boolean
  disabled?: boolean
  dragAndDrop?: boolean
}