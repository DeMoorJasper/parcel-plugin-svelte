<script>
  import { onMount } from 'svelte';

  export let name = 'Anonymous';
  let time = new Date();

  onMount(() => {
    const timer = setInterval(() => {
      time = new Date();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  let hours, minutes, seconds, image;

  $: {
    hours = time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
    image = require('./blobaston.png');
  }
</script>

<style>
  .the-time {
    font-weight: bold;
  }
</style>

<div>
  <h1>Hello {name},</h1>
  <p>
    the time is
    <span class="the-time">{hours}:{minutes}:{seconds}</span>
  </p>
  <div>
    <img src={image} alt />
  </div>
</div>
