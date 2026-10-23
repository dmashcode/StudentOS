export const EDUCATION_LEVELS = [
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'law', label: 'Law' },
  { value: 'competitive_exam', label: 'Competitive exam' },
  { value: 'language_learning', label: 'Language learning' },
  { value: 'other', label: 'Other' },
]

export function educationLabel(value) {
  return EDUCATION_LEVELS.find((level) => level.value === value)?.label
}