#!/usr/bin/env node

/**
 * Скрипт для тестирования интеграции Frontend с API
 * 
 * Использование:
 *   node scripts/test-api-integration.js
 * 
 * Или с указанием окружения:
 *   NEXT_PUBLIC_API_URL=https://api-staging.go2asia.space node scripts/test-api-integration.js
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-staging.go2asia.space';

const endpoints = [
  {
    name: 'Content Service - Health',
    url: `${API_URL}/v1/health`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Content Service - Countries',
    url: `${API_URL}/v1/countries?limit=5`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Content Service - Cities',
    url: `${API_URL}/v1/cities?limit=5`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Content Service - Places',
    url: `${API_URL}/v1/places?limit=5`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Content Service - Events',
    url: `${API_URL}/v1/events?limit=5`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Content Service - Articles',
    url: `${API_URL}/v1/articles?limit=5`,
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Token Service - Balance',
    url: `${API_URL}/v1/balance`,
    method: 'GET',
    requiresAuth: true,
  },
  {
    name: 'Token Service - Transactions',
    url: `${API_URL}/v1/transactions?limit=5`,
    method: 'GET',
    requiresAuth: true,
  },
  {
    name: 'Referral Service - Stats',
    url: `${API_URL}/v1/referrals/stats`,
    method: 'GET',
    requiresAuth: true,
  },
];

async function testEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Если требуется авторизация, можно добавить токен
    // Для тестирования без авторизации пропускаем
    if (endpoint.requiresAuth) {
      console.log(`⚠️  ${endpoint.name}: Требует авторизацию (пропуск)`);
      return { success: false, skipped: true };
    }

    const response = await fetch(endpoint.url, options);
    const duration = Date.now() - startTime;
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { error: 'Invalid JSON response' };
    }

    if (response.ok) {
      console.log(`✅ ${endpoint.name}: ${response.status} (${duration}ms)`);
      if (data.data && Array.isArray(data.data)) {
        console.log(`   └─ Загружено ${data.data.length} элементов`);
      }
      return { success: true, status: response.status, duration, data };
    } else {
      console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText} (${duration}ms)`);
      if (data.error) {
        console.log(`   └─ Ошибка: ${JSON.stringify(data.error)}`);
      }
      return { success: false, status: response.status, duration, error: data };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${endpoint.name}: Ошибка сети (${duration}ms)`);
    console.log(`   └─ ${error.message}`);
    return { success: false, duration, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Тестирование интеграции Frontend с API\n');
  console.log(`📍 API URL: ${API_URL}\n`);
  console.log('─'.repeat(60));

  const results = {
    total: endpoints.length,
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    
    if (result.skipped) {
      results.skipped++;
    } else if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('─'.repeat(60));
  console.log('\n📊 Результаты тестирования:');
  console.log(`   Всего: ${results.total}`);
  console.log(`   ✅ Успешно: ${results.success}`);
  console.log(`   ❌ Ошибки: ${results.failed}`);
  console.log(`   ⚠️  Пропущено: ${results.skipped}`);

  if (results.failed > 0) {
    console.log('\n⚠️  Некоторые endpoints вернули ошибки. Проверьте логи выше.');
    process.exit(1);
  } else {
    console.log('\n✅ Все публичные endpoints работают корректно!');
    process.exit(0);
  }
}

// Запуск тестов
runTests().catch(error => {
  console.error('💥 Критическая ошибка:', error);
  process.exit(1);
});

