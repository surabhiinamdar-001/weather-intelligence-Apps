import {
  CurrentWeatherData,
  DailyForecastDay,
  WeatherIntelligenceSummary,
  WeatherRecommendation,
  ActivityScore,
} from '../types/weather';

export function generateWeatherIntelligence(
  current: CurrentWeatherData,
  daily: DailyForecastDay[]
): WeatherIntelligenceSummary {
  const recommendations: WeatherRecommendation[] = [];
  const precautions: string[] = [];
  const todayForecast = daily[0];

  const temp = current.temperature;
  const feelsLike = current.apparentTemperature;
  const wind = current.windSpeed;
  const rainProb = todayForecast?.precipitationProbability ?? 0;
  const rainSum = todayForecast?.precipitationSum ?? 0;
  const currentRain = current.precipitation;
  const uv = current.uvIndex || (todayForecast?.uvIndexMax ?? 0);
  const code = current.weatherCode;

  const isRain =
    currentRain > 0.2 ||
    rainProb >= 50 ||
    rainSum >= 2.0 ||
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);

  const isSnow = [71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(code);
  const isStorm = [95, 96, 99].includes(code);

  // 1. Precipitation & Storm Rules
  if (isStorm) {
    recommendations.push({
      id: 'storm-alert',
      category: 'precipitation',
      level: 'warning',
      title: 'Thunderstorm Warning',
      advice:
        'Active electrical storm conditions detected. Postpone outdoor sports, stay away from tall trees and open water, and remain indoors until storms clear.',
      clothingTips: ['Waterproof hooded parka', 'Rubber-soled boots'],
    });
    precautions.push('Thunderstorm activity present; prioritize indoor spaces.');
  } else if (isSnow) {
    recommendations.push({
      id: 'snow-alert',
      category: 'precipitation',
      level: 'warning',
      title: 'Winter Snow & Ice Advisory',
      advice:
        'Snowfall or freezing precipitation present. Surfaces may be slippery with ice. Allow extra commuting time and take smaller steps when walking.',
      clothingTips: ['Insulated winter boots', 'Waterproof coat', 'Gloves & beanie'],
    });
    precautions.push('Risk of icy footpaths and low tire traction.');
  } else if (currentRain > 2.0 || rainProb >= 75) {
    recommendations.push({
      id: 'heavy-rain-protection',
      category: 'precipitation',
      level: 'caution',
      title: 'Rain Protection Essential',
      advice:
        'Significant precipitation is occurring or highly likely today. A sturdy umbrella, hooded waterproof jacket, and water-repellent footwear are strongly recommended.',
      clothingTips: ['Full waterproof coat', 'Sturdy umbrella', 'Waterproof footwear'],
    });
    precautions.push('Keep an umbrella on hand throughout the day.');
  } else if (rainProb >= 40 || currentRain > 0) {
    recommendations.push({
      id: 'moderate-rain-prep',
      category: 'precipitation',
      level: 'info',
      title: 'Passing Showers Possible',
      advice:
        'Scattered rain showers are forecast. A compact folding umbrella or water-resistant shell jacket will keep you dry if showers hit.',
      clothingTips: ['Compact umbrella', 'Water-resistant outer shell'],
    });
  }

  // 2. Temperature Rules
  if (temp >= 32 || feelsLike >= 35) {
    recommendations.push({
      id: 'extreme-heat',
      category: 'temperature',
      level: 'warning',
      title: 'High Heat & Hydration Alert',
      advice:
        'Elevated ambient temperatures pose a heat stress risk. Drink plenty of water (at least 2.5L), limit strenuous outdoor workouts between 12 PM - 4 PM, and seek air-conditioned environments.',
      clothingTips: ['Loose-fitting cotton/linen', 'Wide-brim hat', 'UV sunglasses'],
    });
    precautions.push('Increase fluid intake; avoid prolonged direct sun exposure.');
  } else if (temp >= 26) {
    recommendations.push({
      id: 'warm-weather',
      category: 'temperature',
      level: 'info',
      title: 'Warm Summer Conditions',
      advice:
        'Warm and pleasant temperatures. Stay hydrated, wear light breathable clothing, and consider shade during peak afternoon hours.',
      clothingTips: ['T-shirt or light shirt', 'Shorts or light trousers', 'Sunglasses'],
    });
  } else if (temp <= 0 || feelsLike <= -3) {
    recommendations.push({
      id: 'freezing-cold',
      category: 'temperature',
      level: 'warning',
      title: 'Sub-Zero Freeze Precaution',
      advice:
        'Sub-zero freeze conditions. Exposed skin can lose heat rapidly. Dress in heavy thermal layers, cover ears and fingers, and beware of frost on bridges and steps.',
      clothingTips: ['Thermal base layer', 'Down insulated coat', 'Wool socks & gloves'],
    });
    precautions.push('Freezing conditions; dress warmly with thermal insulation.');
  } else if (temp <= 8 || feelsLike <= 5) {
    recommendations.push({
      id: 'chilly-cold',
      category: 'temperature',
      level: 'caution',
      title: 'Chilly Conditions: Layer Up',
      advice:
        'Brisk, cool air will feel brisk especially in breezy areas. A warm sweater under a windproof coat, plus a light scarf or beanie, will keep you comfortable.',
      clothingTips: ['Knit sweater / fleece', 'Mid-weight coat', 'Light scarf'],
    });
  } else if (temp >= 18 && temp <= 25 && !isRain && wind < 25) {
    recommendations.push({
      id: 'optimal-outdoor',
      category: 'general',
      level: 'optimal',
      title: 'Optimal Outdoor Conditions',
      advice:
        'Mild, comfortable temperatures and light winds make this an exceptional time for walking, cycling, running, or outdoor social activities.',
      clothingTips: ['Casual layers', 'Comfortable sneakers'],
    });
  }

  // 3. Wind Rules
  if (wind >= 45) {
    recommendations.push({
      id: 'high-wind',
      category: 'wind',
      level: 'warning',
      title: 'High Wind Caution',
      advice:
        `Strong wind gusts up to ${Math.round(current.windGusts || wind)} km/h. High-profile vehicles should exercise caution, umbrellas may invert, and loose outdoor furniture should be secured.`,
      clothingTips: ['Fitted windbreaker', 'Eye protection against blowing dust'],
    });
    precautions.push('Strong winds present; be careful with loose items and cycling.');
  } else if (wind >= 30) {
    recommendations.push({
      id: 'moderate-wind',
      category: 'wind',
      level: 'info',
      title: 'Noticeable Breeze',
      advice:
        'Brisk winds will make temperatures feel several degrees cooler than measured. A wind-resistant jacket is recommended.',
      clothingTips: ['Wind-resistant shell jacket'],
    });
  }

  // 4. UV Index Rules
  if (uv >= 7) {
    recommendations.push({
      id: 'high-uv',
      category: 'uv',
      level: 'caution',
      title: 'High UV Radiation Index',
      advice:
        `Peak UV index is reaching ${uv.toFixed(1)}. Unprotected skin can burn within 20 minutes. Apply broad-spectrum SPF 30+ sunscreen and wear sunglasses.`,
      clothingTips: ['UV sunglasses', 'Sunscreen SPF 30+', 'Protective hat'],
    });
    precautions.push(`Elevated UV index (${uv.toFixed(1)}); apply sun protection.`);
  } else if (uv >= 4 && temp > 15) {
    recommendations.push({
      id: 'moderate-uv',
      category: 'uv',
      level: 'info',
      title: 'Moderate UV Exposure',
      advice:
        'Moderate ultraviolet levels expected during midday hours. Consider sunscreen if planning extended outdoor exposure.',
      clothingTips: ['Sunscreen for extended outdoor stays'],
    });
  }

  // Ensure there is at least one clear recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'general-mild',
      category: 'general',
      level: 'info',
      title: 'Fair Weather Conditions',
      advice:
        'Stable conditions prevail. Standard casual attire is suitable for typical daily activities.',
      clothingTips: ['Standard daytime clothing', 'Comfortable footwear'],
    });
  }

  // Dynamic Headline
  let headline = 'Favorable weather across the region.';
  if (isStorm) {
    headline = 'Severe weather alert: Thunderstorms in progress.';
  } else if (isSnow) {
    headline = 'Winter weather advisory: Snow and freezing temperatures.';
  } else if (isRain) {
    headline = 'Wet weather pattern: Expect rain and damp conditions.';
  } else if (temp >= 30) {
    headline = 'Heat advisory: Warm sun with high thermal index.';
  } else if (temp <= 2) {
    headline = 'Cold snap: Low temperatures and chilly winds.';
  } else if (wind >= 40) {
    headline = 'Windy alert: Gusty atmospheric flow across the area.';
  } else if (temp >= 18 && temp <= 25) {
    headline = 'Pleasant atmospheric conditions ideal for outdoor plans.';
  }

  // Deterministic Activity Readiness Scores (0 - 100)
  const activities: ActivityScore[] = [
    calculateRunningScore(temp, feelsLike, wind, rainProb, currentRain, code),
    calculateCyclingScore(temp, wind, current.windGusts, rainProb, currentRain, code),
    calculateOutdoorDiningScore(temp, wind, rainProb, currentRain, code),
    calculateHikingScore(temp, wind, rainProb, currentRain, code),
    calculateCommutingScore(wind, currentRain, rainProb, code),
  ];

  // Deterministic Clothing Guide
  const clothingGuide = deriveClothingGuide(temp, feelsLike, isRain, isSnow, wind, uv);

  return {
    headline,
    recommendations,
    activities,
    clothingGuide,
    keyPrecautions: precautions.length > 0 ? precautions : ['Conditions are stable; normal caution applies.'],
  };
}

function calculateRunningScore(
  temp: number,
  feelsLike: number,
  wind: number,
  rainProb: number,
  currentRain: number,
  code: number
): ActivityScore {
  let score = 95;
  let reasons: string[] = [];

  if (temp < 10) {
    const penalty = Math.min(30, (10 - temp) * 2.5);
    score -= penalty;
    if (temp < 2) reasons.push('chilly air');
  } else if (temp > 18) {
    const penalty = Math.min(45, (temp - 18) * 3);
    score -= penalty;
    if (temp > 24) reasons.push('elevated heat');
  }

  if (currentRain > 1 || [61, 63, 65, 80, 81, 82].includes(code)) {
    score -= 35;
    reasons.push('wet tracks');
  } else if (rainProb > 50) {
    score -= 15;
    reasons.push('rain risk');
  }

  if (wind > 35) {
    score -= 25;
    reasons.push('headwinds');
  }

  if ([95, 96, 99].includes(code)) {
    score = 10;
    reasons = ['thunderstorm danger'];
  }

  score = Math.max(10, Math.min(100, Math.round(score)));

  let status: ActivityScore['status'] = 'Ideal';
  if (score >= 85) status = 'Ideal';
  else if (score >= 70) status = 'Good';
  else if (score >= 50) status = 'Fair';
  else if (score >= 30) status = 'Challenging';
  else status = 'Not Recommended';

  const reasonText =
    reasons.length > 0
      ? `Impacted by ${reasons.join(', ')}`
      : 'Optimal thermal balance and low wind';

  return {
    name: 'Running & Jogging',
    category: 'Running',
    score,
    status,
    reason: reasonText,
  };
}

function calculateCyclingScore(
  temp: number,
  wind: number,
  gusts: number,
  rainProb: number,
  currentRain: number,
  code: number
): ActivityScore {
  let score = 92;
  const reasons: string[] = [];

  if (wind > 35 || gusts > 45) {
    score -= 40;
    reasons.push('strong crosswinds');
  } else if (wind > 22) {
    score -= 15;
    reasons.push('moderate breeze');
  }

  if (currentRain > 0.5 || [61, 63, 65, 80, 81, 82].includes(code)) {
    score -= 35;
    reasons.push('slick pavement');
  }

  if (temp < 4) {
    score -= 25;
    reasons.push('freezing hand chill');
  }

  if ([95, 96, 99].includes(code)) {
    score = 5;
    reasons.splice(0, reasons.length, 'lightning risk');
  }

  score = Math.max(5, Math.min(100, Math.round(score)));

  let status: ActivityScore['status'] = 'Ideal';
  if (score >= 80) status = 'Ideal';
  else if (score >= 65) status = 'Good';
  else if (score >= 45) status = 'Fair';
  else if (score >= 25) status = 'Challenging';
  else status = 'Not Recommended';

  return {
    name: 'Road Cycling',
    category: 'Cycling',
    score,
    status,
    reason:
      reasons.length > 0 ? reasons.join(', ') : 'Calm air with dry road traction',
  };
}

function calculateOutdoorDiningScore(
  temp: number,
  wind: number,
  rainProb: number,
  currentRain: number,
  code: number
): ActivityScore {
  let score = 90;
  const reasons: string[] = [];

  if (temp < 17) {
    score -= Math.min(40, (17 - temp) * 3);
    reasons.push('cool ambient temp');
  } else if (temp > 28) {
    score -= Math.min(30, (temp - 28) * 2.5);
    reasons.push('afternoon heat');
  }

  if (rainProb > 40 || currentRain > 0 || [51, 61, 63, 80].includes(code)) {
    score -= 40;
    reasons.push('rain risk');
  }

  if (wind > 25) {
    score -= 25;
    reasons.push('gusty wind');
  }

  score = Math.max(10, Math.min(100, Math.round(score)));

  let status: ActivityScore['status'] = 'Ideal';
  if (score >= 80) status = 'Ideal';
  else if (score >= 65) status = 'Good';
  else if (score >= 45) status = 'Fair';
  else if (score >= 25) status = 'Challenging';
  else status = 'Not Recommended';

  return {
    name: 'Patio & Outdoor Dining',
    category: 'Outdoor Dining',
    score,
    status,
    reason:
      reasons.length > 0
        ? reasons.join(', ')
        : 'Pleasant temperature and gentle air movement',
  };
}

function calculateHikingScore(
  temp: number,
  wind: number,
  rainProb: number,
  currentRain: number,
  code: number
): ActivityScore {
  let score = 90;
  const reasons: string[] = [];

  if (currentRain > 1 || [61, 63, 65, 81, 82].includes(code)) {
    score -= 45;
    reasons.push('muddy slippery trails');
  } else if (rainProb > 50) {
    score -= 20;
    reasons.push('showers forecasted');
  }

  if ([45, 48].includes(code)) {
    score -= 25;
    reasons.push('reduced fog visibility');
  }

  if (wind > 35) {
    score -= 20;
    reasons.push('exposed ridge winds');
  }

  if (temp < 5) {
    score -= 15;
    reasons.push('cold summit conditions');
  }

  score = Math.max(10, Math.min(100, Math.round(score)));

  let status: ActivityScore['status'] = 'Ideal';
  if (score >= 80) status = 'Ideal';
  else if (score >= 65) status = 'Good';
  else if (score >= 45) status = 'Fair';
  else if (score >= 25) status = 'Challenging';
  else status = 'Not Recommended';

  return {
    name: 'Trail Hiking & Walking',
    category: 'Hiking',
    score,
    status,
    reason:
      reasons.length > 0 ? reasons.join(', ') : 'Good trail conditions and clear paths',
  };
}

function calculateCommutingScore(
  wind: number,
  currentRain: number,
  rainProb: number,
  code: number
): ActivityScore {
  let score = 95;
  const reasons: string[] = [];

  if ([95, 96, 99].includes(code)) {
    score -= 50;
    reasons.push('severe weather delays');
  }
  if ([71, 73, 75, 85, 86].includes(code)) {
    score -= 45;
    reasons.push('snow transit disruptions');
  }
  if (currentRain > 2 || [63, 65, 82].includes(code)) {
    score -= 30;
    reasons.push('rain traffic slow downs');
  } else if (rainProb > 60) {
    score -= 10;
    reasons.push('wet roads');
  }
  if ([45, 48].includes(code)) {
    score -= 25;
    reasons.push('fog visibility slowdown');
  }

  score = Math.max(15, Math.min(100, Math.round(score)));

  let status: ActivityScore['status'] = 'Ideal';
  if (score >= 85) status = 'Ideal';
  else if (score >= 70) status = 'Good';
  else if (score >= 50) status = 'Fair';
  else if (score >= 30) status = 'Challenging';
  else status = 'Not Recommended';

  return {
    name: 'Daily Commuting',
    category: 'Commuting',
    score,
    status,
    reason: reasons.length > 0 ? reasons.join(', ') : 'Smooth transit conditions',
  };
}

function deriveClothingGuide(
  temp: number,
  feelsLike: number,
  isRain: boolean,
  isSnow: boolean,
  wind: number,
  uv: number
) {
  let upper = 'Short sleeve t-shirt or polo';
  let lower = 'Comfortable shorts or light chinos';
  let footwear = 'Breathable walking shoes / sneakers';
  const accessories: string[] = [];

  if (temp >= 28) {
    upper = 'Ultra-light breathable t-shirt or linen top';
    lower = 'Lightweight shorts or breathable skirts/trousers';
    footwear = 'Ventilated sneakers or sandals';
  } else if (temp >= 21) {
    upper = 'Short-sleeve shirt or light casual polo';
    lower = 'Casual trousers, chinos, or jeans';
    footwear = 'Comfortable daily sneakers';
  } else if (temp >= 15) {
    upper = 'Long-sleeve tee with light cardigan or denim jacket';
    lower = 'Jeans or cotton trousers';
    footwear = 'Closed sneakers or loafers';
  } else if (temp >= 8) {
    upper = 'Warm sweater or fleece with a windbreaker jacket';
    lower = 'Thick jeans or wool-blend trousers';
    footwear = 'Ankle boots or cushioned leather sneakers';
  } else if (temp >= 0) {
    upper = 'Thermal base layer + heavy knit sweater + winter jacket';
    lower = 'Lined pants or thermal jeans';
    footwear = 'Insulated water-resistant boots';
    accessories.push('Knit beanie', 'Warm gloves');
  } else {
    upper = 'Thermal undershirt + heavy fleece + down parka';
    lower = 'Thermal long johns + heavy insulated pants';
    footwear = 'Winter snow boots with traction grip';
    accessories.push('Insulated gloves', 'Thermal scarf', 'Winter toque / beanie');
  }

  if (isRain) {
    footwear = 'Waterproof shoes or rubber-soled rain boots';
    accessories.push('Sturdy umbrella', 'Waterproof rain jacket');
  }
  if (isSnow) {
    footwear = 'Treaded winter snow boots';
    accessories.push('Thermal gloves', 'Snow cap', 'Neck gaiter');
  }
  if (wind >= 30 && !isRain) {
    accessories.push('Wind-blocking shell layer');
  }
  if (uv >= 5) {
    accessories.push('Polarized sunglasses', 'SPF 30+ sunscreen');
  }

  const uniqueAccessories = Array.from(new Set(accessories));

  return {
    upper,
    lower,
    footwear,
    accessories: uniqueAccessories.length > 0 ? uniqueAccessories : ['No special weather accessories required'],
  };
}
