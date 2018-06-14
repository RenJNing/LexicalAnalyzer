export default function (TB, A, state2pattern) {
    let _range = length => Array.from({ length }).map((v, k) => k);
	var transitionTable = TB;
	var alphabet = A;
	// acceptState2patternId: 一个数组，成员为（js对象），state:接受态id，REId:正则表达式id
	var acceptState2patternId = state2pattern;
	// 先根据转换表生成 NFA 图的节点和边信息，可视化用。 
	// var NFAStates = _range(1, transitionTable.length);
	var NFAStates = _range(transitionTable.length);
	// var NFAStates = _range(transitionTable.length+1);
	var NFAStatesTransition = [];
	var NFAAcceptStates = acceptState2patternId.map(obj => {
		return obj.state;
	})
	for (var f_state of _range(transitionTable.length)) {
		for (var ch_index of _range(alphabet.length)) {
			for (var t_state of transitionTable[f_state][ch_index]) {
				NFAStatesTransition.push({ from: f_state, to: t_state, arrows: 'to', label: alphabet[ch_index] });
			}
		}
	}


	// state是NFA的当前状态，states是NFA的当前状态集, maximalMunchState 是NFA当前到达的最长子串接受态
	var text;
	var scanStartIndex = -1;
	var scanEndIndex = -1;
	// currentStates： NFA 当前状态集合: 成员： js对象 {stateId: 4, fromId: 3}
	// acceptedStates： NFA 走过接受态的集合,记录状态id 和 走到该状态的偏移量，
	// 例如： [ {stateId: 5, offset: 3, fromId: 4}, [...] ]
	// 多添加 fromId 保留可视化信息， （状态机本来不需要记住这个东西。。。）
	var currentStates = [];
	var acceptedStates = [];
	// historialStates 存放状态历史，每次next压入一个 
	// {scanStartIndex: scanStartIndex, scanEndIndex: scanEndIndex, currentStates: currentStates, acceptedStates:acceptedStates}
	// 
	var historialStates = [];
	var historialVisualInfos = [];
	var historialWindowInfos = [];
	// 


	return {
		getNFAStates: function () {
			return NFAStates;
		},
		getNFAStatesTransition: function () {
			return NFAStatesTransition;
		},
		getNFAAcceptStates: function () {
			return NFAAcceptStates;
		},
		init: function () {
			console.log("--- init()");
			// 开始匹配新的 Token 是调用： 第一次开始使用 NFA时， 以及 每次匹配到一个 Token 准备匹配新的 Token 时
			// 默认初始态是 state = 1
			currentStates = [];
			acceptedStates = [];

			currentStates.push({ stateId: 0, fromId: -1 });
		},
		feedText: function (t) {
			text = t;
		},
		nextStep: function () {
			// CODE = 0 时候返回
			// CODE = 1 时候返回：可视化信息， 以及匹配到token的信息
			// CODE = 2 时候返回：可视化信息
			// CODE = 3 时候返回：用户输入的文本已经完成Token提取
			// CODE = 5 时候返回：可视化信息, 表示因为用户输入流已经到结尾，被迫进行Token提取，区别于 CODE = 1 的主动Token提取
			var CODE = 0;

			// 状态机内部的 scanEndIndex 已经达到用户输入的文本的尾巴
			// 此时如果 scanStartIndex === scanEndIndex， 则
			//     说明用户给 已经构建的词法分析器 输入的文本已经消耗完了（全部成功提前成为Token流）
			//     此时调用nextStep一直返回 code = 4
			// 否则，说明文本不够状态机继续跑，强制想提取 Token （如果不能提取的话，就是失败了）
			if (scanEndIndex === (text.length - 1)) {
				// 
				if (scanStartIndex === scanEndIndex) {
					CODE = 4;
					var resp = {
						code: CODE
					};
					return resp;
				} else {
					// end > start, harh of the string, need to accept some and continue, if cant accept, then fail
					if (acceptedStates.length === 0) {
						CODE = 0;
						console.log(`fail to recognize at: ${scanStartIndex+1}`);
						var resp = {
							code: CODE
						};
						return resp;
					} else {
						CODE = 5; // 返回可视化， 以及匹配到token的信息


						var accept_state;
						var re_id;
						var maxOffset = 0;

						for (var obj of acceptedStates) {
							if (obj.offset > maxOffset) {
								maxOffset = obj.offset;
								accept_state = obj.stateId;
							}
						}
						for (var obj of acceptState2patternId) {
							if (obj.state === accept_state) {
								re_id = obj.REId;
								break;
							}
						}


						// 重置 NFA， 
						// 重置 NFA内部的 scan index (scanStartIndex和scanEndIndex右移切掉的token的长度maxOffset)
						// 重置 反馈给可视化的 scanning 的 index (scanning.startIndex和scanning.endIndex)
						// 可视化的信息也要对应到状态机信息，全部重置
						var recognizedTokens;
						var scanning;
						var remains;
						if (historialWindowInfos.length === 0) {
							recognizedTokens = [];
						} else {
							recognizedTokens = historialWindowInfos[historialWindowInfos.length - 1].recognizedTokens;
						}
						recognizedTokens.push({
							startIndex: scanStartIndex + 1,
							endIndex: scanStartIndex + maxOffset,
							REId: re_id
						});

						scanStartIndex += maxOffset;
						scanEndIndex = scanStartIndex;
						scanning = {
							// startIndex:scanStartIndex+1,
							// endIndex:scanEndIndex+1
							startIndex: -1,
							endIndex: -1
						};
						remains = {
							startIndex: scanEndIndex + 1,
							endIndex: text.length - 1
						};
						// this.init();
						currentStates = [];
						acceptedStates = [];
						// highlightNodes = [0];
						// highlightEdges = [];

						currentStates.push({ stateId: 0, fromId: -1 });

						historialStates.push({
							scanStartIndex: scanStartIndex,
							scanEndIndex: scanEndIndex,
							currentStates: currentStates,
							acceptedStates: acceptedStates
						});
						historialVisualInfos.push({
							highlightNodes: highlightNodes,
							highlightEdges: highlightEdges,
							StringWindow: {}
						});
						historialWindowInfos.push({
							recognizedTokens: recognizedTokens,
							scanning: scanning,
							remains: remains
						});

						console.log('accept REId: ' + re_id);

						// 返回可视化， 以及匹配到token的信息
						resp = {
							code: CODE,
							info: historialVisualInfos[historialVisualInfos.length - 1],
							windowInfo: historialWindowInfos[historialWindowInfos.length - 1]
						};
						return resp;
					}
				}
			}

			// 处理 Epsilon 变迁
			// 如果 当前状态集合 currentStates 里存在着 1个或多个状态可以进行 currentStates 变迁。
			//      则把 nextChar设置为 ε 或 Epsilon， 并且不用更新扫描窗口的 index： scanStartIndex 和 scanEndIndex
			// 否则， 继续读取用户输入的流中的下一个字符，并且更新窗口信息
			var isEpsilon = false;
			for (var s of currentStates) {
				var epsilonIndex = alphabet.indexOf('ε');
				var f_state = s.stateId;
				var states = transitionTable[f_state][epsilonIndex];
				if (states.length != 0) {
					isEpsilon = true;
					break;
				}
			}

			var nextScanEndIndex;
			var nextChar;
			var nextCharIndex;
			if (isEpsilon === true) {
				nextScanEndIndex = scanEndIndex;
				nextChar = 'ε';
				nextCharIndex = alphabet.indexOf('ε');

			} else {
				nextScanEndIndex = scanEndIndex + 1;
				nextChar = text[nextScanEndIndex];
				nextCharIndex = alphabet.indexOf(nextChar);

			}
			//scanning = {startIndex:scanStartIndex+1, endIndex: scanEndIndex+1};
			//remains = {startIndex:scanEndIndex+2, endIndex: text.length-1};

			console.log('current scan window start: ' + scanStartIndex);
			console.log('current scan window end: ' + scanEndIndex);
			console.log('look at: #' + nextScanEndIndex + ' char');


			var nextStates = [];
			// var nextAcceptStates = [];
			var nextAcceptStates = acceptedStates;
			// 要保存的可视化信息
			var highlightNodes = [];
			var highlightEdges = [];

			for (var s of currentStates) {
				var f_state = s.stateId;
				var states = transitionTable[f_state][nextCharIndex];
				if (states.length != 0) {
					var offset = nextScanEndIndex - scanStartIndex;
					for (var t_state of states) {
						highlightNodes.push(t_state);
						highlightEdges.push({ from: f_state, to: t_state });
						if (NFAAcceptStates.indexOf(t_state) === -1) {
							// ss 存在而且不是接受态，压入新的 nextStates
							nextStates.push({ stateId: t_state, fromId: f_state });

						} else {
							// ss 存在而且是接受态， 压入新的 nextAcceptStates
							nextAcceptStates.push({ stateId: t_state, offset: offset, fromId: f_state });
						}
					}
				}
			}

			// 根据 nextStates 和 nextAcceptStates 判断当前 NFA 状态。
			if (nextStates.length === 0) {
				// 对于当前处理的字符（包括 用户流中的字符 以及 Epsilon，）没有下一步状态，
				// 匹配已经结束， CODE = 0 或 CODE = 1
				// 意味着没有跳跃状态过，不用处理 Epsilon
				if (nextAcceptStates.length === 0) {
					CODE = 0; // 返回错误
					// 没有走到任何一个 pattern 的接受态
					// 词法分析器无法用定义的 pattern 去匹配当前的Token。
					// TODO: 给用户反馈		
					// 标记 CODE = 0， 在return 中给出反馈
				} else {
					CODE = 1; // 返回可视化， 以及匹配到token的信息
					// 已经走到了至少一个 pattern 的接受态， 根据 Maximal Munch 选择 pattern

					var accept_state;
					var re_id;
					var maxOffset = 0;

					for (var obj of nextAcceptStates) {
						if (obj.offset > maxOffset) {
							maxOffset = obj.offset;
							accept_state = obj.stateId;
						}
					}
					for (var obj of acceptState2patternId) {
						if (obj.state === accept_state) {
							re_id = obj.REId;
							break;
						}
					}

					// 重置 NFA， 
					// 重置 NFA内部的 scan index (scanStartIndex和scanEndIndex右移切掉的token的长度maxOffset)
					// 重置 反馈给可视化的 scanning 的 index (scanning.startIndex和scanning.endIndex)
					// 可视化的信息也要对应到状态机信息，全部重置
					var recognizedTokens;
					var scanning;
					var remains;
					if (historialWindowInfos.length === 0) {
						recognizedTokens = [];
					} else {
						recognizedTokens = historialWindowInfos[historialWindowInfos.length - 1].recognizedTokens;
					}
					recognizedTokens.push({
						startIndex: scanStartIndex + 1,
						endIndex: scanStartIndex + maxOffset,
						REId: re_id
					});

					scanStartIndex += maxOffset;
					scanEndIndex = scanStartIndex;
					scanning = {
						// startIndex:scanStartIndex+1,
						// endIndex:scanEndIndex+1
						startIndex: -1,
						endIndex: -1
					};
					remains = {
						startIndex: scanEndIndex + 1,
						endIndex: text.length - 1
					};
					// this.init();
					currentStates = [];
					acceptedStates = [];
					// highlightNodes = [0];
					// highlightEdges = [];

					currentStates.push({ stateId: 0, fromId: -1 });

					historialStates.push({
						scanStartIndex: scanStartIndex,
						scanEndIndex: scanEndIndex,
						currentStates: currentStates,
						acceptedStates: acceptedStates
					});
					historialVisualInfos.push({
						highlightNodes: highlightNodes,
						highlightEdges: highlightEdges,
						StringWindow: {}
					});
					historialWindowInfos.push({
						recognizedTokens: recognizedTokens,
						scanning: scanning,
						remains: remains
					});

					console.log('accept REId: ' + re_id);
				}
			} else {
				// 存在当前处理的字符（包括 用户流中的字符 以及 Epsilon，）的下一步状态
				// 匹配还没有结束
				CODE = 2; // 返回可视化

				var recognizedTokens;
				var scanning;
				var remains;
				if (historialWindowInfos.length === 0) {
					recognizedTokens = [];
				} else {
					recognizedTokens = historialWindowInfos[historialWindowInfos.length - 1].recognizedTokens;
				}
				if (isEpsilon === false) {
					// 扫描的窗口右移一位
					scanEndIndex++;
					scanning = { startIndex: scanStartIndex + 1, endIndex: scanEndIndex };
					remains = { startIndex: scanEndIndex + 1, endIndex: text.length - 1 };
				} else {
					// 可视化的窗口 和上一次不变
					if (historialWindowInfos.length === 0) {
						// 刚开始跑状态机
						scanning = { startIndex: -1, endIndex: -1 };
						remains = { startIndex: 0, endIndex: text.length - 1 };
					} else {
						scanning = historialWindowInfos[historialWindowInfos.length - 1].scanning;
						remains = historialWindowInfos[historialWindowInfos.length - 1].remains;
					}
				}


				currentStates = nextStates;
				acceptedStates = nextAcceptStates;
				historialStates.push({
					scanStartIndex: scanStartIndex,
					scanEndIndex: scanEndIndex,
					currentStates: currentStates,
					acceptedStates: acceptedStates
				});
				historialVisualInfos.push({
					highlightNodes: highlightNodes,
					highlightEdges: highlightEdges,
					StringWindow: {}
				});
				historialWindowInfos.push({
					recognizedTokens: recognizedTokens,
					scanning: scanning,
					remains: remains
				});

			}
			//
			var resp;
			if (CODE === 0) {
				// 返回错误
				console.log(`fail to recognize at: ${scanStartIndex+1}`);
				resp = {
					code: CODE
				};
				return resp;
			} else if (CODE === 1) {
				// 返回可视化， 以及匹配到token的信息
				resp = {
					code: CODE,
					info: historialVisualInfos[historialVisualInfos.length - 1],
					windowInfo: historialWindowInfos[historialWindowInfos.length - 1]
				};
				return resp;
			} else if (CODE === 2) {
				// 返回可视化
				resp = {
					code: CODE,
					info: historialVisualInfos[historialVisualInfos.length - 1],
					windowInfo: historialWindowInfos[historialWindowInfos.length - 1]
				};
				return resp;
			}
		},
		preStep: function () {
			console.log("--- ");
			
		}

	} // end return
}



