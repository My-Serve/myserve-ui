import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {
    private storedRoutes = new Map<string, DetachedRouteHandle>();

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // Check if the route data has a 'reuse' property set to true
        return route.data['reuse'] === true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const id = this.getRouteId(route);
        if (id) {
            this.storedRoutes.set(id, handle);
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const id = this.getRouteId(route);
        return !!id && !!this.storedRoutes.get(id);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const id = this.getRouteId(route);
        if (!id) {
            return null;
        }
        return this.storedRoutes.get(id) || null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
      return false;
    }

    private getRouteId(route: ActivatedRouteSnapshot): string | null {
        // You can customize this to create a unique identifier for your routes
        return route.routeConfig ? route.routeConfig.path! : null;
    }
}
