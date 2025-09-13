import {
	createEffect,
	onCleanup,
	onMount,
	splitProps,
	type JSX
} from 'solid-js'
import { animate, inView } from 'motion'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'

type NumberTickerProps = JSX.IntrinsicElements['span'] & {
	value: number
	startValue?: number
	direction?: 'up' | 'down'
	delay?: number
	decimalPlaces?: number
	once?: boolean
	margin?: `${number}px` | `${number}%` | string
}

export function NumberTicker(allProps: NumberTickerProps) {
    const { currentColor } = useTheme()
	const [props, others] = splitProps(allProps, [
		'value',
		'startValue',
		'direction',
		'delay',
		'decimalPlaces',
		'class',
		'once',
		'margin',
		'children'
	])

	let el!: HTMLSpanElement
	let hasStarted = false
	let controls: ReturnType<typeof animate> | undefined

	const startValue = () => props.startValue ?? 0
	const direction = () => props.direction ?? 'up'
	const delay = () => props.delay ?? 0
	const decimalPlaces = () => props.decimalPlaces ?? 0
	const once = () => props.once ?? true
	const margin = () => props.margin ?? '0px'

	const formatNumber = (n: number) =>
		new Intl.NumberFormat('en-US', {
			minimumFractionDigits: decimalPlaces(),
			maximumFractionDigits: decimalPlaces()
		}).format(Number(n.toFixed(decimalPlaces())))

	const runAnimation = (from: number, to: number) => {
		controls?.stop?.()
		controls = animate(from, to, {
			delay: delay(),
			type: 'spring',
			damping: 60,
			stiffness: 100,
			onUpdate: (latest: number) => {
				if (el) el.textContent = formatNumber(latest)
			}
		})
	}

	const initialText = () => {
		return String(startValue())
	}

	onMount(() => {
		if (el) el.textContent = formatNumber(Number(initialText()))

		let stop = () => {}
		stop = inView(
			el,
			() => {
				if (!hasStarted || !once()) {
					hasStarted = true
					const from = direction() === 'down' ? props.value : startValue()
					const to = direction() === 'down' ? startValue() : props.value
					runAnimation(from, to)
					if (once()) stop()
				}
				return () => {
					if (!once()) hasStarted = false
				}
			},
			{ margin: margin(), amount: 'some' }
		)

		onCleanup(() => {
			stop?.()
			controls?.stop?.()
		})
	})

	createEffect(() => {
		const v = props.value
		const sv = startValue()
		const dir = direction()
		const dly = delay()
		const dp = decimalPlaces()
		void dly
		void dp

		if (!el) return
		if (!hasStarted) return

		const from = dir === 'down' ? v : sv
		const to = dir === 'down' ? sv : v
		runAnimation(from, to)
	})

	return (
		<span
			ref={el}
			class={cn(
				'inline-block tabular-nums tracking-wider text-black dark:text-white',
				props.class
			)}
			style={{ color: currentColor() }}
			{...others}
		>
			{initialText()}
		</span>
	)
}
