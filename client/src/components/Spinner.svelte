<script>
    import { ConicGradient } from '@skeletonlabs/skeleton';
// import type { ConicStop } from '@skeletonlabs/skeleton';
    const conicStops = [
        { color: 'transparent', start: 0, end: 25 },
        { color: 'rgb(var(--color-primary-500))', start: 75, end: 100 }
    ];
</script>

<ConicGradient stops={conicStops} spin>Loading...</ConicGradient>