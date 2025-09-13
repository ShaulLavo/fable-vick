import { Accessor, JSX, createEffect, createSignal, onCleanup, onMount, splitProps } from 'solid-js'
import { animate } from 'motion'

type CollapseProps = JSX.IntrinsicElements['div'] & {
  open: boolean | Accessor<boolean>
  duration?: number
}

export function Collapse(allProps: CollapseProps) {
  const [props, others] = splitProps(allProps, ['open', 'duration', 'children', 'class', 'style'])
  let el!: HTMLDivElement
  const d = () => props.duration ?? 0.25
  const isOpen = () => (typeof props.open === 'function' ? (props.open as Accessor<boolean>)() : props.open)

  const setHidden = (hidden: boolean) => {
    if (!el) return
    el.style.display = hidden ? 'none' : 'block'
  }

  const expand = () => {
    if (!el) return
    // Prepare
    el.style.display = 'block'
    const h = el.scrollHeight
    el.style.overflow = 'hidden'
    el.style.height = '0px'
    el.style.opacity = '0'

    const controls = animate(
      el,
      { height: [`0px`, `${h}px`], opacity: [0, 1] },
      { duration: d(), easing: [0.2, 0, 0, 1] }
    )
    controls.finished.finally(() => {
      if (!el) return
      el.style.overflow = ''
      el.style.height = 'auto'
      el.style.opacity = '1'
    })
  }

  const collapse = () => {
    if (!el) return
    const h = el.scrollHeight
    el.style.overflow = 'hidden'
    el.style.height = `${h}px`
    el.style.opacity = '1'
    const controls = animate(
      el,
      { height: [`${h}px`, `0px`], opacity: [1, 0] },
      { duration: d(), easing: [0.2, 0, 0, 1] }
    )
    controls.finished.finally(() => {
      if (!el) return
      setHidden(true)
      el.style.overflow = ''
      el.style.height = '0px'
    })
  }

  onMount(() => {
    setHidden(!isOpen())
    if (isOpen()) {
      // Ensure natural layout when initially open
      el.style.height = 'auto'
      el.style.opacity = '1'
    } else {
      el.style.height = '0px'
      el.style.opacity = '0'
    }
  })

  createEffect(() => {
    const o = isOpen()
    if (o) expand()
    else collapse()
  })

  onCleanup(() => {
    // no-op
  })

  return (
    <div ref={el} class={props.class} style={props.style} {...others}>
      {props.children}
    </div>
  )
}

