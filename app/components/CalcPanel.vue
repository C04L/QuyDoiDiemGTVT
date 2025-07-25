<script setup lang="ts">
import {getAllMethodConverted, getScoreRange, isValidScore, type PTXT, type AllMethodReturnType} from "~/utils/calculator";

const method: Ref<PTXT> = ref('THPT');
const score: Ref<number> = ref(0);
const Calculated: Ref<AllMethodReturnType | null> = ref(null);
const inputError: Ref<string> = ref('');

const methods = [
  { value: 'THPT', label: 'THPT (Thi tốt nghiệp THPT)' },
  { value: 'TSA', label: 'TSA (Thi Đánh giá năng lực)' },
  { value: 'HSA', label: 'HSA (Thi đánh giá tư duy)' },
  { value: 'HOCBA', label: 'Điểm xét học bạ' }
];

function calculate() {
  inputError.value = '';

  if (!score.value || score.value <= 0) {
    inputError.value = 'Vui lòng nhập điểm số hợp lệ';
    Calculated.value = null;
    return;
  }

  if (!isValidScore(score.value, method.value)) {
    const range = getScoreRange(method.value);
    inputError.value = `Điểm số phải nằm trong khoảng ${range.min} - ${range.max} cho phương thức ${method.value}`;
    Calculated.value = null;
    return;
  }

  Calculated.value = getAllMethodConverted(score.value, method.value);
}

function formatScore(score: number | null): string {
  return score !== null ? score.toString() : 'Không thể chuyển đổi';
}

watch(method, () => {
  Calculated.value = null;
  inputError.value = '';
});
</script>

<template>
  <div class="bg-white shadow-lg p-8 rounded-md my-8">
    <h1 class="uppercase font-semibold text-yellow-600 text-xl mb-6">
      quy đổi điểm tuyển sinh trường đại học giao thông vận tải (UTC)
    </h1>

    <section class="space-y-6">
      <!-- Method Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Chọn phương thức tuyển sinh:
        </label>
        <select
            v-model="method"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          <option v-for="methodOption in methods" :key="methodOption.value" :value="methodOption.value">
            {{ methodOption.label }}
          </option>
        </select>
      </div>

      <!-- Score Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nhập điểm số của bạn:
        </label>
        <input
            v-model.number="score"
            type="number"
            step="0.01"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Ví dụ: 25.5"
        />
        <div v-if="method" class="text-xs text-gray-500 mt-1">
          Khoảng điểm hợp lệ: {{ getScoreRange(method).min }} - {{ getScoreRange(method).max }}
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="inputError" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
        {{ inputError }}
      </div>

      <!-- Calculate Button -->
      <button
          @click="calculate"
          class="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
      >
        Tính toán quy đổi điểm
      </button>

      <!-- Results -->
      <div v-if="Calculated" class="mt-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Kết quả quy đổi:</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 p-4 rounded-md">
            <h3 class="font-medium text-blue-800">THPT (Thi tốt nghiệp THPT)</h3>
            <p class="text-2xl font-bold text-blue-600">{{ formatScore(Calculated.thpt) }}</p>
          </div>

          <div class="bg-green-50 p-4 rounded-md">
            <h3 class="font-medium text-green-800">TSA (Thi Đánh giá năng lực)</h3>
            <p class="text-2xl font-bold text-green-600">{{ formatScore(Calculated.tsa) }}</p>
          </div>

          <div class="bg-purple-50 p-4 rounded-md">
            <h3 class="font-medium text-purple-800">HSA (Học bạ THPT)</h3>
            <p class="text-2xl font-bold text-purple-600">{{ formatScore(Calculated.hsa) }}</p>
          </div>

          <div class="bg-orange-50 p-4 rounded-md">
            <h3 class="font-medium text-orange-800">HOCBA (Học bạ lớp 12)</h3>
            <p class="text-2xl font-bold text-orange-600">{{ formatScore(Calculated.hocba) }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>