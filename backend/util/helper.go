package util

func UpdateIfNotNil[T any](src *T, dst *T) {
	if src != nil {
		*dst = *src
	}
}
