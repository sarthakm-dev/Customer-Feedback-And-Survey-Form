export type TableActionHandlers = {
    onView?: (index:number)=> void;
    onEdit?: (index:number)=>void;
    onDelete?: (index:number)=>void;
}