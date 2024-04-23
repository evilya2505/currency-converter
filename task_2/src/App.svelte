<script lang="ts">
  import mainApi from './utils/api';
  import {
    DECIMAL_PRECISION,
    CURRENCY_CODES
  } from './utils/constants';
  import {
    convert,
    formatField
  } from './utils/utils';

  let isLoading: boolean = false;
  let isError: boolean = false;

  let timerId: number = 0;
  let lastChanged : string = "currencyCodeFrom";
  let currentRate: string | null = null;

  let currentCodeFrom = CURRENCY_CODES[0][0];
  let currentCodeTo = CURRENCY_CODES[1][0];

  let amountTo = "";
  let amountFrom = "";

  $: amountFrom = formatField(amountFrom);
  $: amountTo = formatField(amountTo);

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value.split(" - ")[0];

    isLoading = true;
    lastChanged = target.id;

    mainApi.getExchangeRate(value)
      .then(res => {
        const result = getResults(target.id, res.rates);

        amountTo = result;
      })
      .catch(err => isError = true)
      .finally(() => isLoading = false);
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;

    lastChanged = 'currencyCodeFrom';

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      isLoading = true;

      mainApi.getExchangeRate(currentCodeFrom).then(res => {

        const result = getResults(target.name, res.rates);

        switch (target.name) {
          case 'amountFrom':
            amountTo = result;
            break;
          case 'amountTo':
            amountFrom = result;
            break;
          default:
            break;
        }
      }).catch(err => isError = true).finally(() => {
        isLoading = false;
        clearTimeout(timerId);
      })
    }, 2000);
  }

  function getResults(changedField: string, rates: Record < string, number > ): string  {
    const result = convert(parseFloat(amountFrom), parseFloat(amountTo), currentCodeFrom, currentCodeTo, rates, changedField);
    currentRate = rates[(lastChanged === 'currencyCodeFrom') ? currentCodeTo : currentCodeFrom].toFixed(DECIMAL_PRECISION);

    return result;
  }
</script>

<main class="content">
  <form class="form content__form">
    <h1 class="form__title">Конвертер валют</h1>
    <p class="form__subtitle form__subtitle_type_info">
      {#if currentRate}
      {1} {lastChanged  === "currencyCodeFrom" ? currentCodeFrom : currentCodeTo} &#8776; {currentRate} {lastChanged  === "currencyCodeFrom" ? currentCodeTo : currentCodeFrom}
      {/if}
    </p>
    <fieldset class="form__fieldset">
      <input
        class="form__input"
        name="amountFrom"
        autocomplete="off"
        placeholder="0"
        disabled={isLoading}
        on:keypress={handleInputChange}
        bind:value={amountFrom}
        />
      <select disabled={isLoading} class="form__input" id="currencyCodeFrom" bind:value={currentCodeFrom} on:change={handleChange}>
        {#each CURRENCY_CODES as currencyCode}
        <option value={currencyCode[0]}>{currencyCode[0]} - {currencyCode[1]}</option>
        {/each}
      </select>
    </fieldset>
    <svg class="form__icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.883px" height="85.208px" viewBox="0 0 122.883 85.208" enable-background="new 0 0 122.883 85.208" xml:space="preserve"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M122.883,28.086L93.668,0l-0.004,18.078h-26.66h-0.506H41.932v20.019H66.5l0,0 h27.164l0.004,18.08L122.883,28.086L122.883,28.086z M0,57.118l29.215-28.087l0.002,18.078h26.661h0.506h24.567v20.019H56.382l0,0 H29.217l-0.002,18.08L0,57.118L0,57.118z"/></g></svg>
    <fieldset class="form__fieldset">
      <input
        class="form__input"
        name="amountTo"
        autocomplete="off"
        placeholder="0"
        disabled={isLoading}
        bind:value={amountTo}
        on:keypress={handleInputChange}
          />
      <select class="form__input" disabled={isLoading} id="currencyCodeTo" bind:value={currentCodeTo} on:change={handleChange}>
        {#each CURRENCY_CODES as currencyCode}
        <option value={currencyCode[0]}>{currencyCode[0]} - {currencyCode[1]}</option>
        {/each}
      </select>
    </fieldset>
    <p class="form__subtitle form__subtitle_type_error">
      {#if isError}
      Произошла ошибка. Попробуйте снова.
      {/if}
    </p>
  </form>
</main>
