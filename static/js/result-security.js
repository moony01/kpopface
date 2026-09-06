/**
 * Result data validation shared by the result router and dynamic result views.
 *
 * Result data lives in sessionStorage, so it must be treated as untrusted even
 * though it was normally produced by the local model. This module keeps the
 * allowed values small before they reach a template or a style attribute.
 */
(function (global) {
  'use strict';

  var AGENCY_NAMES = {
    sm: 'SM',
    jyp: 'JYP',
    yg: 'YG'
  };
  var MAX_TEXT_LENGTH = 2000;
  var MAX_IMAGE_LENGTH = 4 * 1024 * 1024;

  function normalizeAgency(value) {
    if (typeof value !== 'string') return null;
    var agency = value.toLowerCase();
    return Object.prototype.hasOwnProperty.call(AGENCY_NAMES, agency) ? agency : null;
  }

  function normalizePercent(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.round(Math.max(0, Math.min(100, number)));
  }

  function normalizePredictions(predictions) {
    if (!Array.isArray(predictions)) return [];

    return predictions.map(function (item) {
      if (!item || typeof item !== 'object') return null;
      var agency = normalizeAgency(item.agency);
      if (!agency) return null;
      return {
        agency: agency,
        percent: normalizePercent(item.percent)
      };
    }).filter(Boolean);
  }

  function normalizeGender(value) {
    return value === 'male' ? 'male' : 'female';
  }

  function normalizeText(value) {
    if (typeof value !== 'string') return '';
    return value.slice(0, MAX_TEXT_LENGTH);
  }

  function normalizeImage(value) {
    if (typeof value !== 'string' || value.length > MAX_IMAGE_LENGTH) return '';
    if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(value)) return value;
    if (/^blob:/i.test(value)) return value;
    return '';
  }

  function normalizeResult(value) {
    var parsed = value;
    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        return null;
      }
    }

    if (!parsed || typeof parsed !== 'object') return null;
    var results = normalizePredictions(parsed.results);
    if (!results.length) return null;

    return {
      id: normalizeText(parsed.id).slice(0, 64),
      timestamp: Number.isFinite(Number(parsed.timestamp)) ? Number(parsed.timestamp) : 0,
      gender: normalizeGender(parsed.gender),
      image: normalizeImage(parsed.image),
      results: results,
      resultTitle: normalizeText(parsed.resultTitle),
      resultExplain: normalizeText(parsed.resultExplain),
      resultCeleb: normalizeText(parsed.resultCeleb),
      viewedDetail: parsed.viewedDetail === true
    };
  }

  global.KpopfaceResultSecurity = {
    agencyNames: AGENCY_NAMES,
    normalizeAgency: normalizeAgency,
    normalizePercent: normalizePercent,
    normalizePredictions: normalizePredictions,
    normalizeResult: normalizeResult,
    parseStoredResult: normalizeResult
  };
}(window));
