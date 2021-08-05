import { gql } from "@apollo/client";

export const getFeeling = gql`
query Feeling($text: String!) {
	feeling(text: $text) {
		score
	}
}
`
