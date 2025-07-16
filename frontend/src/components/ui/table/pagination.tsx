import { URLPagination, URLPaginationProps } from '../pagination';

export type TablePaginationProps = URLPaginationProps;

export const TablePagination = (props: TablePaginationProps) => {
  return <URLPagination {...props} />;
};
