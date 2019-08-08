/*
 *  Phusion Passenger - https://www.phusionpassenger.com/
 *  Copyright (c) 2017 Phusion Holding B.V.
 *
 *  "Passenger", "Phusion Passenger" and "Union Station" are registered
 *  trademarks of Phusion Holding B.V.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
#ifndef _PASSENGER_CONFIG_KIT_PREFIX_TRANSLATOR_H_
#define _PASSENGER_CONFIG_KIT_PREFIX_TRANSLATOR_H_

#include <boost/bind.hpp>
#include <cassert>
#include <string>
#include <vector>
#include <jsoncpp/json.h>

#include <ConfigKit/Common.h>
#include <StaticString.h>

namespace Passenger {
namespace ConfigKit {

using namespace std;


/**
 * A translator that translates keys by adding a prefix.
 *
 * You can learn more about translators in the ConfigKit README, section
 * "The special problem of overlapping configuration names and translation".
 */
class PrefixTranslator {
private:
	string prefix;
	bool finalized;

	string translateErrorKey(const StaticString &key) const {
		return "{{" + translateOne(key) + "}}";
	}

	string reverseTranslateErrorKey(const StaticString &key) const {
		return "{{" + reverseTranslateOne(key) + "}}";
	}

public:
	PrefixTranslator()
		: finalized(false)
		{ }

	PrefixTranslator(const string &_prefix)
		: prefix(_prefix),
		  finalized(true)
		{ }

	void setPrefixAndFinalize(const string &_prefix) {
		assert(!finalized);
		prefix = _prefix;
		finalized = true;
	}

	bool isFinalized() const {
		return finalized;
	}

	Json::Value translate(const Json::Value &doc) const {
		assert(finalized);
		Json::Value result(Json::objectValue);
		Json::Value::const_iterator it, end = doc.end();

		for (it = doc.begin(); it != end; it++) {
			const char *keyEnd;
			const char *key = it.memberName(&keyEnd);
			result[translateOne(StaticString(key, keyEnd - key))] = *it;
		}

		return result;
	}

	Json::Value reverseTranslate(const Json::Value &doc) const {
		assert(finalized);
		Json::Value result(Json::objectValue);
		Json::Value::const_iterator it, end = doc.end();

		for (it = doc.begin(); it != end; it++) {
			const char *keyEnd;
			const char *key = it.memberName(&keyEnd);
			result[reverseTranslateOne(StaticString(key, keyEnd - key))] = *it;
		}

		return result;
	}

	vector<Error> translate(const vector<Error> &errors) const {
		assert(finalized);
		vector<Error> result;
		vector<Error>::const_iterator it, end = errors.end();
		Error::KeyProcessor keyProcessor =
			boost::bind(&PrefixTranslator::translateErrorKey, this,
				boost::placeholders::_1);

		for (it = errors.begin(); it != end; it++) {
			const Error &error = *it;
			result.push_back(Error(error.getMessage(keyProcessor)));
		}

		return result;
	}

	vector<Error> reverseTranslate(const vector<Error> &errors) const {
		assert(finalized);
		vector<Error> result;
		vector<Error>::const_iterator it, end = errors.end();
		Error::KeyProcessor keyProcessor =
			boost::bind(&PrefixTranslator::reverseTranslateErrorKey, this,
				boost::placeholders::_1);

		for (it = errors.begin(); it != end; it++) {
			const Error &error = *it;
			result.push_back(Error(error.getMessage(keyProcessor)));
		}

		return result;
	}

	string translateOne(const StaticString &key) const {
		assert(finalized);
		if (key.substr(0, prefix.size()) == prefix) {
			return key.substr(prefix.size());
		} else {
			return key;
		}
	}

	string reverseTranslateOne(const StaticString &key) const {
		assert(finalized);
		if (key.substr(0, prefix.size()) != prefix) {
			return prefix + key;
		} else {
			return key;
		}
	}
};


} // namespace ConfigKit
} // namespace Passenger

#endif /* _PASSENGER_CONFIG_KIT_PREFIX_TRANSLATOR_H_ */
