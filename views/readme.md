### Module Renderer

*module.ejs*
```ejs
<button (click)="purchaseItem($event)">
    <span>Purchase</span>
</button>
```

*module.js*
```typescript
export class Module {

  /**
   * Ajax call to server
   */
  purchaseItem (event: Event): void {
    console.log('Item purchased')
  }
}
```
