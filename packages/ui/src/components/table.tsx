import type { Selection } from "@heroui/react";
import { EmptyState, Table } from "@heroui/react";
import { useState } from "react";
import { CheckboxForDataTable } from "./checkbox";

interface Column {
	id: string;
	name: string;
}

interface Row {
	[columnId: string]: string | undefined;
}

// 汎用テーブル
export function DataTable({
	columns,
	rows,
	children,
}: {
	columns: Column[];
	rows: Row[];
	children: React.ReactNode;
}) {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content
					aria-label="Table with selection"
					selectedKeys={selectedKeys}
					selectionMode="multiple"
					onSelectionChange={setSelectedKeys}
				>
					<Table.Header columns={columns}>
						{(column) => (
							<Table.Column>
								<div className="flex flex-row items-center gap-2">
									{column.id === columns[0]?.id ? (
										<CheckboxForDataTable />
									) : null}
									{column.name}
								</div>
							</Table.Column>
						)}
					</Table.Header>
					<Table.Body
						renderEmptyState={() => <EmptyState>データがありません</EmptyState>}
						items={rows}
					>
						{(row) => (
							<Table.Row>
								<Table.Collection items={columns}>
									{(column) => (
										<Table.Cell>
											<div className="flex flex-row items-center gap-2">
												{column.id === columns[0]?.id ? (
													<CheckboxForDataTable />
												) : null}
												{row[column.id]}
											</div>
										</Table.Cell>
									)}
								</Table.Collection>
							</Table.Row>
						)}
					</Table.Body>
					<Table.Footer>{children}</Table.Footer>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}
