import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QueryMergeService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  mergeQuery(newParams: Record<string, any>): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    const mergedParams = { ...currentParams, ...newParams };

    Object.keys(mergedParams).forEach((key) => {
      if (mergedParams[key] === null || mergedParams[key] === undefined) {
        delete mergedParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: mergedParams,
      queryParamsHandling: 'replace',
    });
  }

  getCurrentUrl(): string {
    return this.router.url;
  }
}
