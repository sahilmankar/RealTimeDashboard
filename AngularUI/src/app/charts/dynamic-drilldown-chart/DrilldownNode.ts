import { ApiRow } from "./ApiRow";

export interface DrilldownNode {
  label: string;
  labels: string[];
  data: number[];
  children?: DrilldownNode[];
}

  export function buildDrilldownTree(
    data: ApiRow[],
    groupKeys: string[],
    amountKey: string = 'amount',
    currentLevel: number = 0,
    parentLabel: string | null = null
  ): DrilldownNode | null {
    if (currentLevel >= groupKeys.length) return null;

    const groupKey = groupKeys[currentLevel];

    const groups = data.reduce((acc, row) => {
      const key = row[groupKey];
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key)!.push(row);
      return acc;
    }, new Map<string, ApiRow[]>());

    const labels: string[] = [];
    const dataValues: number[] = [];
    const children: DrilldownNode[] = [];

    for (const [key, rows] of groups.entries()) {
      labels.push(key);
      const sumAmount = rows.reduce((sum, r) => sum + r[amountKey], 0);
      dataValues.push(sumAmount);

      const childNode = buildDrilldownTree(
        rows,
        groupKeys,
        amountKey,
        currentLevel + 1,
        key
      );
      if (childNode) {
        children.push(childNode);
      }
    }

    return {
      label: parentLabel ?? groupKey[0],
      labels,
      data: dataValues,
      children: children.length > 0 ? children : undefined,
    };
  }