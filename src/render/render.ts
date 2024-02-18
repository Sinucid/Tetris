import { GameConfig, FieldMap, shapesMapping } from "../models";
import { Bar, BarConfig } from ".";

export class Render {
  protected bar = new Bar();

  createTemplate(
    config: GameConfig,
    field: FieldMap,
    barConfig: BarConfig,
  ): void {
    const template = new DocumentFragment();
    template.appendChild(this.createField(field));
    template.appendChild(this.createScoresBar(barConfig));

    document.getElementById(config.root)!.appendChild(template);
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

  protected createField(field: FieldMap): HTMLElement {
    const table = document.createElement("table");
    table.id = "table";
    table.innerHTML = field
      .map((row, i) =>
        this.createRow(row.map((_, j) => this.createCell(i, j)).join("")),
      )
      .join("");
    return table;
  }

  protected createRow(content: string): string {
    return `<tr>${content}</tr>`;
  }

  protected createCell(i: number, j: number): string {
    return `<td style="color: var(--cell-${i}-${j}, white);"></td>`;
  }

  updateScoresBar(config: BarConfig): void {
    this.bar.updateBar(config);
  }

  protected createScoresBar(config: BarConfig): HTMLElement {
    const aside = document.createElement("aside");
    aside.appendChild(this.bar.createBar(config));
    return aside;
  }
}
