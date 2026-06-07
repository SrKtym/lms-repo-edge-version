import { Pagination } from "@heroui/react";

interface DefaultPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

// 汎用ページネーションコンポーネント
export function DefaultPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}: DefaultPaginationProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);
	const displayStartItem = Math.min(startItem, endItem);

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			Array.from({ length: totalPages }, (_, i) => i + 1).forEach((i) =>
				pages.push(i),
			);
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("ellipsis");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push("ellipsis");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("ellipsis");
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push("ellipsis");
				pages.push(totalPages);
			}
		}
		return pages;
	};

	return (
		<Pagination>
			<Pagination.Summary>
				{displayStartItem} to {endItem} of {totalItems}
			</Pagination.Summary>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous
						isDisabled={currentPage === 1}
						onPress={() => onPageChange(currentPage - 1)}
					>
						<Pagination.PreviousIcon />
						<span>前のページ</span>
					</Pagination.Previous>
				</Pagination.Item>
				{getPageNumbers().map((page, index) =>
					page === "ellipsis" ? (
						<Pagination.Item key={`ellipsis-${index}`}>
							<Pagination.Ellipsis />
						</Pagination.Item>
					) : (
						<Pagination.Item key={page}>
							<Pagination.Link
								isActive={page === currentPage}
								onPress={() => onPageChange(page as number)}
							>
								{page}
							</Pagination.Link>
						</Pagination.Item>
					),
				)}
				<Pagination.Item>
					<Pagination.Next
						isDisabled={currentPage === totalPages}
						onPress={() => onPageChange(currentPage + 1)}
					>
						<span>次のページ</span>
						<Pagination.NextIcon />
					</Pagination.Next>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination>
	);
}
