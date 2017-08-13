# Servant

```typescript
import { Server } from 'servant'

Server.bootStrap(AppModule)


@Module({
  routes: [
    {
      path: '',
      default: true,
      page: HomePage
    }
  ]
})
export class AppModule {}


@Page({
  data: './home-page.json'
})
export class HomePage {
  svOnInit (): void {
  }
}
```
