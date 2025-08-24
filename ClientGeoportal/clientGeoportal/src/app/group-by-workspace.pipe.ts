import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'groupByWorkspace' })
export class GroupByWorkspacePipe implements PipeTransform {
  transform(layers: any[]): Record<string, any[]> {
    return layers.reduce((groups: Record<string, any[]>, item: any) => {
      const key = item.workspace;
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});
  }
}
