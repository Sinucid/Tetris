import { FieldMap, shapesMapping } from "../models";

export class FieldRenderer {
  createField(field: FieldMap): string {
    return `
			<table id="table">
				${field
          .map((row, i) =>
            this.createRow(row.map((_, j) => this.createCell(i, j)).join("")),
          )
          .join("")}
			</table>
		`;
  }

  updateFields(field: FieldMap): void {
    const table = document.getElementById("table");
    if (table) {
      field.forEach((row, i) => {
        row.forEach((cell, j) => {
          const cssPropName = `--cell-${i}-${j}`;
          if (cell) {
            const shapeType = (shapesMapping[cell - 1] as string).toLowerCase();
            table.style.setProperty(cssPropName, `var(--color-${shapeType})`);
          } else {
            table.style.removeProperty(cssPropName);
          }
        });
      });
    }
  }

  protected createRow(content: string): string {
    return `<tr>${content}</tr>`;
  }

  protected createCell(i: number, j: number): string {
    return `<td style="background-color: rgba(var(--cell-${i}-${j}), 0.5); outline: rgb(var(--cell-${i}-${j})) solid 4px;"></td>`;
  }
}
