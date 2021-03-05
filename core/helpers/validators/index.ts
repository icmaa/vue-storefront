/** check if string contains some any unicode alphabet characters */
export const unicodeAlpha = (value: string): boolean => /^[a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľŁłĿŀŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſαβΓγΔδεζηΘθικΛλμνΞξΠπρΣσ,ςτυΦφχΨψΩω ]*$/.test(value)

/** check if string contains some any unicode alphabet characters or digits */
export const unicodeAlphaNum = (value: string): boolean => unicodeAlpha(value) || /[0-9]+/.test(value)
