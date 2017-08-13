export function Resource () {

  return function decoratorFactory (target: any) {
    const metadata = Reflect.getMetadata('design:paramtypes', target)

    console.log('metadata\n', metadata && metadata[0] && metadata[0].name)

    const original = target

    const override: any = function (...args) {
      return original.apply(this, args)
    }

    override.prototype = original.prototype

    return override
  }
}
